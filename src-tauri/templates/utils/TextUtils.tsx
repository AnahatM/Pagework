import React from "react";
import { Link } from "react-router-dom";

/**
 * Simple text parser with markdown-style formatting
 * Supports: Links [text](url), Bold **text**, Italic *text*, Underline _text_, and combinations
 */

// Parse text with formatting patterns
function parseText(text: string): React.ReactNode {
  if (!text) return "";

  // Links first (highest priority)
  const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    const [fullMatch, linkText, linkUrl] = linkMatch;
    const before = text.substring(0, text.indexOf(fullMatch));
    const after = text.substring(text.indexOf(fullMatch) + fullMatch.length);

    return (
      <>
        {before && parseText(before)}
        {linkUrl.startsWith("/") ? (
          <Link to={linkUrl} className="inline-link">
            {parseText(linkText)}
          </Link>
        ) : (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="inline-link">
            {parseText(linkText)}
          </a>
        )}
        {after && parseText(after)}
      </>
    );
  }

  // Combined patterns (more specific first)
  // Italic + Underline: *_text_*
  let match = text.match(/\*_([^_*]+)_\*/);
  if (match) {
    return parseWithPattern(text, match, (content) => (
      <em className="text-italic">
        <u className="text-underline">{content}</u>
      </em>
    ));
  }

  // Bold + Underline: **_text_**
  match = text.match(/\*\*_([^_*]+)_\*\*/);
  if (match) {
    return parseWithPattern(text, match, (content) => (
      <strong className="text-bold">
        <u className="text-underline">{content}</u>
      </strong>
    ));
  }

  // Bold + Italic: ***text***
  match = text.match(/\*\*\*([^*]+)\*\*\*/);
  if (match) {
    return parseWithPattern(text, match, (content) => (
      <strong className="text-bold">
        <em className="text-italic">{content}</em>
      </strong>
    ));
  }

  // Bold: **text**
  match = text.match(/\*\*([^*]+)\*\*/);
  if (match) {
    return parseWithPattern(text, match, (content) => (
      <strong className="text-bold">{content}</strong>
    ));
  }

  // Underline: _text_
  match = text.match(/_([^_]+)_/);
  if (match) {
    return parseWithPattern(text, match, (content) => <u className="text-underline">{content}</u>);
  }

  // Italic: *text*
  match = text.match(/\*([^*]+)\*/);
  if (match) {
    return parseWithPattern(text, match, (content) => <em className="text-italic">{content}</em>);
  }

  // No patterns found, return text as is
  return text;
}

// Helper to parse text with a pattern
function parseWithPattern(
  text: string,
  match: RegExpMatchArray,
  renderComponent: (content: string) => React.ReactNode
): React.ReactNode {
  const [fullMatch, content] = match;
  const before = text.substring(0, text.indexOf(fullMatch));
  const after = text.substring(text.indexOf(fullMatch) + fullMatch.length);

  return (
    <>
      {before && parseText(before)}
      {renderComponent(content)}
      {after && parseText(after)}
    </>
  );
}

/**
 * Parse formatted text with markdown-style links, bold, italic, and underline text.
 * Handles newlines and preserves formatting.
 *
 * @param text - The input text to parse.
 * @return React.ReactNode - The parsed text with formatting applied.
 */
export function parseFormattedText(text: string): React.ReactNode {
  return parseText(text);
}

export default parseFormattedText;
