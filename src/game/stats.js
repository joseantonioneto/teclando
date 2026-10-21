/**
 * Palavras por minuto. Convenção dos testes de digitação: 1 palavra = 5 caracteres.
 * `minElapsedMs` evita valores absurdos nos primeiros segundos de partida.
 */
export function computeWpm(correctChars, elapsedMs, minElapsedMs = 0) {
  const ms = Math.max(elapsedMs, minElapsedMs)
  if (ms <= 0) return 0
  return Math.round(correctChars / 5 / (ms / 60000))
}

/** Precisão em %, com uma casa decimal. 100 enquanto nenhuma tecla foi digitada. */
export function computeAccuracy(correct, errors) {
  const total = correct + errors
  if (total === 0) return 100
  return Math.round((correct / total) * 1000) / 10
}

export function formatNumber(n) {
  return n.toLocaleString('pt-BR')
}
