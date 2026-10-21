// Teclado virtual: destaca a próxima tecla e pisca em vermelho a tecla errada.

const SHIFT = '⇧'
const SPACE = ' '

const ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
  [SHIFT, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
]

/** Tecla física aproximada de um caractere: remove acento e caixa alta (ç é tecla própria). */
function baseKey(ch) {
  if (!ch) return null
  if (ch === 'ç' || ch === 'Ç') return 'ç'
  return ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function Keyboard({ expected, lastKey }) {
  const target = baseKey(expected)
  const needsShift = Boolean(expected) && expected !== expected.toLowerCase()
  const wrongKey = lastKey && !lastKey.ok ? baseKey(lastKey.key) : null

  function renderKey(k, extra = '', label = k) {
    const isWrong = wrongKey != null && k === wrongKey
    const isTarget = k === target || (k === SHIFT && needsShift)
    const tone = isWrong
      ? 'animate-flash border-rose-400 text-white'
      : isTarget
        ? 'scale-105 border-indigo-300 bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'
        : 'border-white/10 bg-white/5 text-zinc-400'
    return (
      <div
        // key muda a cada erro para a animação reiniciar
        key={isWrong ? `${k}-${lastKey.n}` : k}
        className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm transition ${tone} ${extra}`}
      >
        {label}
      </div>
    )
  }

  return (
    <div className="space-y-1.5 select-none" aria-hidden="true">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((k) => renderKey(k))}
        </div>
      ))}
      <div className="flex justify-center">{renderKey(SPACE, 'w-64', 'espaço')}</div>
    </div>
  )
}
