/**
 * A tiny tokenizer for the API snippets (shell, JS, Python, JSON). It only tints
 * what reads well at a glance: strings, object keys, flags, keywords, calls,
 * numbers and the token env var. No token spans a line, so it runs per line.
 */
export type TokenKind = 'plain' | 'key' | 'string' | 'env' | 'flag' | 'keyword' | 'fn' | 'number'
export type Token = { kind: TokenKind; text: string }

const KINDS = ['key', 'string', 'env', 'flag', 'keyword', 'fn', 'number'] as const

const TOKEN_RE = new RegExp(
  [
    String.raw`(?<key>"(?:[^"\\\n]|\\.)*"(?=\s*:))`,
    String.raw`(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')`,
    String.raw`(?<env>process\.env\.APIFY_TOKEN|os\.environ)`,
    String.raw`(?<flag>(?<=\s)--?[A-Za-z][\w-]*)`,
    String.raw`(?<keyword>\b(?:curl|import|from|const|await|print|True|False|None|true|false|null)\b)`,
    String.raw`(?<fn>\b[A-Za-z_]\w*(?=\())`,
    String.raw`(?<number>\b\d+(?:\.\d+)?\b)`,
  ].join('|'),
  'g',
)

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const match of line.matchAll(TOKEN_RE)) {
    const index = match.index
    if (index > last) tokens.push({ kind: 'plain', text: line.slice(last, index) })
    const kind = KINDS.find((name) => match.groups?.[name] !== undefined) ?? 'plain'
    tokens.push({ kind, text: match[0] })
    last = index + match[0].length
  }
  if (last < line.length) tokens.push({ kind: 'plain', text: line.slice(last) })
  return tokens
}

export function highlight(code: string): Token[][] {
  return code.split('\n').map(tokenizeLine)
}
