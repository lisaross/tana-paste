import { Clipboard, showHUD } from "@raycast/api";
import { convertToTana } from "./utils/tana-converter";

export default async function Command() {
  try {
    // Get clipboard content
    const clipboardText = await Clipboard.readText();
    
    if (!clipboardText) {
      await showHUD("No text in clipboard");
      return;
    }

    // Convert to Tana format
    const tanaOutput = convertToTana(clipboardText);
    
    // Copy back to clipboard
    await Clipboard.copy(tanaOutput);
    
    // Show success message
    await showHUD("Converted to Tana format ✨");
  } catch (error) {
    console.error('Error processing text:', error);
    await showHUD("Failed to convert text");
  }
} 