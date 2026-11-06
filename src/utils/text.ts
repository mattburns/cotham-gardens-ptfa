// Turn a Markdown body into plain text, for descriptions in link previews
// and calendar entries.
export function markdownToText(markdown: string | undefined): string {
  return (markdown ?? '')
    .replace(/!\[.*?\]\(.*?\)/g, '') // strip images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links → just the text
    .replace(/[#*_>`]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
