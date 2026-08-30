// A tiny pub/sub bridge so a formula box rendered deep inside MDX content
// can open the single, page-level AskClaude chat and pre-fill it with a
// starter question about that specific snippet — without threading a
// shared context/prop through the whole MDX component tree just for this.
export const ASK_AI_SNIPPET_EVENT = 'xlsdocs:ask-ai-snippet';

export function requestAskAIAboutSnippet(snippet: string) {
  window.dispatchEvent(new CustomEvent<string>(ASK_AI_SNIPPET_EVENT, { detail: snippet }));
}
