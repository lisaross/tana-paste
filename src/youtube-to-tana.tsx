import { Clipboard, showHUD, BrowserExtension, Toast, showToast } from '@raycast/api'
import { convertToTana } from './utils/tana-converter'
import { YoutubeTranscript } from 'youtube-transcript'

interface VideoInfo {
  title: string
  channelName: string
  channelUrl: string
  url: string
  videoId: string
  description: string
  transcript?: string // Make transcript optional
}

/**
 * Extracts video information from the active YouTube tab
 */
async function extractVideoInfo(): Promise<VideoInfo> {
  try {
    // Get the active tab
    const tabs = await BrowserExtension.getTabs()

    if (!tabs || tabs.length === 0) {
      throw new Error(
        'Could not access browser tabs. Please ensure Raycast has permission to access your browser.'
      )
    }

    // Find the active YouTube tab
    const activeTab = tabs.find((tab) => tab.active && tab.url?.includes('youtube.com/watch'))

    if (!activeTab) {
      throw new Error(
        'No active YouTube video tab found. Please open a YouTube video and try again.'
      )
    }

    // Extract the video ID from URL
    const urlObj = new URL(activeTab.url)
    const videoId = urlObj.searchParams.get('v')

    if (!videoId) {
      throw new Error('Could not extract video ID from the URL.')
    }

    // Extract title directly from the tab
    const title = await BrowserExtension.getContent({
      cssSelector: 'h1.ytd-video-primary-info-renderer',
      format: 'text',
      tabId: activeTab.id,
    })

    if (!title) {
      throw new Error(
        'Could not find video title. Please make sure the video page is fully loaded.'
      )
    }

    // Extract channel name and URL
    const channelElement = await BrowserExtension.getContent({
      cssSelector: '#channel-name yt-formatted-string a',
      format: 'html',
      tabId: activeTab.id,
    })

    if (!channelElement) {
      throw new Error(
        'Could not find channel information. Please make sure the video page is fully loaded.'
      )
    }

    // Extract channel name and URL using string manipulation
    const hrefMatch = channelElement.match(/href="([^"]+)"/)
    const textMatch = channelElement.match(/<a[^>]*>([^<]+)<\/a>/)

    if (!hrefMatch || !textMatch) {
      throw new Error('Could not parse channel information.')
    }

    const channelUrl = hrefMatch[1]
    const channelName = textMatch[1].trim()

    // Format the channel URL
    const fullChannelUrl = channelUrl.startsWith('http')
      ? channelUrl
      : `https://www.youtube.com${channelUrl}`

    // Extract description - try multiple selectors for expanded content
    const descriptionSelectors = [
      'ytd-text-inline-expander yt-attributed-string',
      'ytd-text-inline-expander yt-formatted-string',
      'ytd-text-inline-expander #snippet-text',
      'ytd-text-inline-expander #plain-snippet-text',
    ]

    let description = ''

    for (const selector of descriptionSelectors) {
      description = await BrowserExtension.getContent({
        cssSelector: selector,
        format: 'text',
        tabId: activeTab.id,
      })
      if (description) {
        break
      }
    }

    if (!description) {
      throw new Error(
        'Could not find video description. Please make sure the video page is fully loaded and the description is visible.'
      )
    }

    // Clean up the description
    const cleanedDescription = description
      .replace(/Show more$/, '') // Remove "Show more" text if present
      .replace(/Show less$/, '') // Remove "Show less" text if present
      .replace(/^\s*\.{3}\s*/, '') // Remove leading ellipsis
      .replace(/\s*\.{3}$/, '') // Remove trailing ellipsis
      .replace(/^\s*Show more\s*\n?/, '') // Remove "Show more" at start
      .replace(/\n?\s*Show less\s*$/, '') // Remove "Show less" at end
      .replace(/^\s+|\s+$/g, '') // Trim whitespace from start and end
      .trim()

    // Return complete VideoInfo
    return {
      title: title.trim(),
      channelName: channelName,
      channelUrl: fullChannelUrl,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      videoId: videoId,
      description: cleanedDescription,
    }
  } catch (error) {
    // Show a persistent error toast with more details
    await showToast({
      style: Toast.Style.Failure,
      title: 'Failed to extract video information',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    })
    throw error
  }
}

/**
 * Extracts the transcript from a YouTube video
 */
async function extractTranscript(videoId: string): Promise<string> {
  try {
    // Fetch transcript using the youtube-transcript library
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId)

    if (!transcriptData || transcriptData.length === 0) {
      throw new Error('No transcript available for this video')
    }

    // Format the transcript segments
    let formattedTranscript = ''
    for (const segment of transcriptData) {
      // Add timestamp if available
      const timestamp = formatTimestamp(segment.offset)
      formattedTranscript += `[${timestamp}] ${segment.text}\n`
    }

    return formattedTranscript
  } catch (error) {
    console.error('Transcript extraction error:', error)
    throw new Error(
      `Could not extract transcript: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Formats milliseconds into MM:SS format
 */
function formatTimestamp(offsetMs: number): string {
  const totalSeconds = Math.floor(offsetMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Formats YouTube video information for Tana in Markdown format
 * that can be processed by our existing Tana converter
 */
function formatForTanaMarkdown(videoInfo: VideoInfo): string {
  // Create a Markdown representation that our tana-converter can process
  let markdown = `# ${videoInfo.title} #video\n`
  markdown += `URL::${videoInfo.url}\n`
  markdown += `Channel URL::${videoInfo.channelUrl}\n`
  markdown += `Author::${videoInfo.channelName}\n`
  markdown += `Description::${videoInfo.description.split('\n\n')[0] || 'No description available'}\n`

  // Add additional description paragraphs as separate nodes
  const descriptionParagraphs = videoInfo.description.split('\n\n').slice(1)
  for (const paragraph of descriptionParagraphs) {
    if (paragraph.trim()) {
      markdown += `\n${paragraph.trim()}`
    }
  }

  // Add transcript if available
  if (videoInfo.transcript) {
    markdown += `\n\n## Transcript\n`
    // Split transcript by lines and format as bullet points
    const transcriptLines = videoInfo.transcript.split('\n')
    for (const line of transcriptLines) {
      if (line.trim()) {
        markdown += `\n- ${line.trim()}`
      }
    }
  }

  return markdown
}

// Main command entry point
export default async function Command() {
  try {
    // Show HUD to indicate processing has started
    await showToast({
      style: Toast.Style.Animated,
      title: 'Processing YouTube Video',
    })

    // Extract video information from the active tab
    const videoInfo = await extractVideoInfo()

    try {
      // Try to extract transcript
      const transcript = await extractTranscript(videoInfo.videoId)
      videoInfo.transcript = transcript
    } catch (transcriptError) {
      // Show a toast but continue
      await showToast({
        style: Toast.Style.Failure,
        title: 'Transcript Extraction Failed',
        message: transcriptError instanceof Error ? transcriptError.message : 'Unknown error',
      })
    }

    // Format and copy to clipboard
    const markdownFormat = formatForTanaMarkdown(videoInfo)
    const tanaFormat = convertToTana(markdownFormat)
    await Clipboard.copy(tanaFormat)

    const successMessage = videoInfo.transcript
      ? 'YouTube video info and transcript copied to clipboard in Tana format'
      : 'YouTube video info copied to clipboard in Tana format (no transcript available)'

    await showHUD(successMessage)
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: 'Processing Failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
