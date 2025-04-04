## Description

The markdown formatting from Claude AI outputs is not being processed correctly when converted to Tana format. This affects several formatting elements, particularly:

- **Bold text**: Bold formatting is not being properly preserved or rendered
- **Indentation**: Bullet point indentation levels are not being correctly maintained
- **Hierarchical structure**: Numbered headings are not properly positioned in the hierarchy
- **Formatting conversion**: Bold text is being converted to italic with asterisks

## Current Behavior

When pasting markdown content generated by Claude into the converter:
1. Bold text (wrapped in ** characters) is incorrectly converted to *__text__* format
2. Hierarchical indentation of bullet points is not preserved correctly
3. Numbered list items that should be parents are indented under previous items
4. The resulting Tana output does not maintain the structural hierarchy intended in the original text

## Expected Behavior

- Bold text formatting should be properly preserved in the conversion
- Indentation levels and hierarchical bullet point structure should be maintained
- Numbered headings should maintain their correct position in the hierarchy
- The output should accurately reflect the semantic structure of the input markdown

## Steps to Reproduce

1. Generate a markdown response from Claude that contains bold formatting and hierarchical bullet points
2. Copy this content to clipboard
3. Use the tana-paste converter to process this content
4. Observe the resulting Tana format has lost or incorrectly rendered the bold formatting and indentation

## Example Input/Output

### Input from Claude (Original Markdown)
```markdown
## The Context Intelligence Framework

### 1. Context Awareness: Knowing What You Know (and Don't)

**Definition:** The ability to identify, inventory, and evaluate the contextual assets your business possesses.

**Key Components:**
- **Knowledge Mapping:** Systematically documenting what your organization knows
- **Context Gaps:** Identifying critical missing contextual elements
- **Context Quality:** Evaluating the accuracy, relevance, and distinctiveness of your context

**Assessment Questions:**
- How comprehensively have we documented our unique business knowledge?
- Where do our most valuable contextual insights reside (people, documents, data, processes)?
- What contextual elements would dramatically improve our decision-making if we had them?

### 2. Context Cultivation: Building Your Contextual Advantage

**Definition:** The systematic practice of gathering, refining, and enriching business context.

**Key Components:**
- **Active Collection:** Processes for continuously capturing valuable context
- **Context Refinement:** Methods for distilling raw information into high-value insights
- **Knowledge Systems:** Infrastructure for organizing and retrieving context

**Assessment Questions:**
- How effectively do we capture insights from customer interactions?
- What systems do we have for documenting and sharing institutional knowledge?
- How well do we preserve context when team members transition?

### 3. Context Curation: Organizing for AI Utilization

**Definition:** The ability to select and structure context for optimal AI application.

**Key Components:**
- **Context Selection:** Identifying the most relevant context for specific AI tasks
- **Context Preparation:** Formatting and structuring context for AI consumption
- **Context Prioritization:** Emphasizing the most impactful contextual elements

**Assessment Questions:**
- How efficiently can we assemble relevant context for new business situations?
- How well do we distinguish between essential and peripheral context?
- What processes do we have for maintaining context quality and relevance?
```

### Output in Tana (Current)
```
%%tana%%
  - The Context Intelligence Framework
    - 1. Context Awareness: Knowing What You Know (and Don't)
  - *__Definition:__* The ability to identify, inventory, and evaluate the contextual assets your business possesses.
  - *__Key Components:__*
  - *__Knowledge Mapping:__* Systematically documenting what your organization knows
  - *__Context Gaps:__* Identifying critical missing contextual elements
  - *__Context Quality:__* Evaluating the accuracy, relevance, and distinctiveness of your context
  - *__Assessment Questions:__*
  - How comprehensively have we documented our unique business knowledge?
  - Where do our most valuable contextual insights reside (people, documents, data, processes)?
  - What contextual elements would dramatically improve our decision-making if we had them?
    - 2. Context Cultivation: Building Your Contextual Advantage
  - *__Definition:__* The systematic practice of gathering, refining, and enriching business context.
  - *__Key Components:__*
  - *__Active Collection:__* Processes for continuously capturing valuable context
  - *__Context Refinement:__* Methods for distilling raw information into high-value insights
  - *__Knowledge Systems:__* Infrastructure for organizing and retrieving context
  - *__Assessment Questions:__*
  - How effectively do we capture insights from customer interactions?
  - What systems do we have for documenting and sharing institutional knowledge?
  - How well do we preserve context when team members transition?
    - 3. Context Curation: Organizing for AI Utilization
  - *__Definition:__* The ability to select and structure context for optimal AI application.
  - *__Key Components:__*
  - *__Context Selection:__* Identifying the most relevant context for specific AI tasks
  - *__Context Preparation:__* Formatting and structuring context for AI consumption
  - *__Context Prioritization:__* Emphasizing the most impactful contextual elements
  - *__Assessment Questions:__*
  - How efficiently can we assemble relevant context for new business situations?
  - How well do we distinguish between essential and peripheral context?
  - What processes do we have for maintaining context quality and relevance?
```

### Expected Output (Ideal)
```
%%tana%%
  - The Context Intelligence Framework
    - 1. Context Awareness: Knowing What You Know (and Don't)
      - **Definition:** The ability to identify, inventory, and evaluate the contextual assets your business possesses.
      - **Key Components:**
        - **Knowledge Mapping:** Systematically documenting what your organization knows
        - **Context Gaps:** Identifying critical missing contextual elements
        - **Context Quality:** Evaluating the accuracy, relevance, and distinctiveness of your context
      - **Assessment Questions:**
        - How comprehensively have we documented our unique business knowledge?
        - Where do our most valuable contextual insights reside (people, documents, data, processes)?
        - What contextual elements would dramatically improve our decision-making if we had them?
    - 2. Context Cultivation: Building Your Contextual Advantage
      - **Definition:** The systematic practice of gathering, refining, and enriching business context.
      - **Key Components:**
        - **Active Collection:** Processes for continuously capturing valuable context
        - **Context Refinement:** Methods for distilling raw information into high-value insights
        - **Knowledge Systems:** Infrastructure for organizing and retrieving context
      - **Assessment Questions:**
        - How effectively do we capture insights from customer interactions?
        - What systems do we have for documenting and sharing institutional knowledge?
        - How well do we preserve context when team members transition?
    - 3. Context Curation: Organizing for AI Utilization
      - **Definition:** The ability to select and structure context for optimal AI application.
      - **Key Components:**
        - **Context Selection:** Identifying the most relevant context for specific AI tasks
        - **Context Preparation:** Formatting and structuring context for AI consumption
        - **Context Prioritization:** Emphasizing the most impactful contextual elements
      - **Assessment Questions:**
        - How efficiently can we assemble relevant context for new business situations?
        - How well do we distinguish between essential and peripheral context?
        - What processes do we have for maintaining context quality and relevance?
```

## Additional Context

This issue appears to be specific to Claude-generated markdown. The formatting used by Claude may have subtle differences from standard markdown that are causing issues with the current parsing logic.

Possible areas to investigate:
- How Claude formats bold text (standard markdown uses **text** format)
- How the converter is handling the bold text conversion (currently turns it into *__text__*)
- How numbered list items are being identified and positioned in the hierarchy
- If indentation is using spaces, tabs, or a combination
- If there are any invisible characters or line endings affecting parsing 