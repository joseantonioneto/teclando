// Mostra o texto-alvo com feedback por caractere:
// verde = acertou, vermelho = errou nessa posição, destaque = próximo caractere.

/** Separa o texto em palavras e espaços, guardando a posição inicial de cada token. */
function tokenize(text) {
  const tokens = []
  let start = 0
  for (const token of text.match(/ |[^ ]+/g) ?? []) {
    tokens.push({ start, token })
    start += token.length
  }
  return tokens
}

export default function TypingText({ text, pos, mistakes, lastKey, className = '' }) {
  const shake = Boolean(lastKey && !lastKey.ok)

  function renderChar(ch, i) {
    if (i === pos) {
      const wrong = mistakes.includes(i)
      const tone = wrong ? 'bg-rose-500/35 text-rose-100' : 'bg-indigo-500/40 text-white'
      return (
        // key muda a cada tecla para a animação de erro reiniciar
        <span
          key={`current-${lastKey?.n ?? 0}`}
          className={`inline-block whitespace-pre rounded-sm ${tone} ${shake ? 'animate-shake' : ''}`}
        >
          {ch}
        </span>
      )
    }
    const tone = i < pos ? (mistakes.includes(i) ? 'text-rose-400' : 'text-emerald-400') : 'text-zinc-500'
    return (
      <span key={i} className={tone}>
        {ch}
      </span>
    )
  }

  return (
    <p className={`font-mono whitespace-pre-wrap ${className}`} aria-label={text}>
      {tokenize(text).map(({ start, token }) => (
        // palavras são inline-block para nunca quebrarem linha no meio
        <span key={start} className={token === ' ' ? '' : 'inline-block'}>
          {Array.from(token).map((ch, i) => renderChar(ch, start + i))}
        </span>
      ))}
    </p>
  )
}
