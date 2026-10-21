import Keyboard from './Keyboard'
import StatCard from './StatCard'
import TypingText from './TypingText'
import { multiplierFor } from '../game/reducer'
import { formatNumber } from '../game/stats'

export default function GameScreen({ state, wpm, accuracy }) {
  const { status, mode, duration, elapsed, items, index, pos, mistakes, score, streak, lastKey } = state

  const totalMs = duration * 1000
  const remainingMs = Math.max(0, totalMs - elapsed)
  const timeLeft = Math.ceil(remainingMs / 1000)
  const timeTone = timeLeft <= 5 ? 'text-rose-400' : timeLeft <= 10 ? 'text-amber-300' : 'text-white'

  const current = items[index] ?? ''
  const upcoming = items.slice(index + 1, index + 4)
  const expected = current[pos]
  const multiplier = multiplierFor(streak)

  const viewProps = { current, upcoming, index, pos, mistakes, lastKey }

  return (
    <section className="w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Tempo" value={`${timeLeft}s`} tone={timeTone} />
        <StatCard label="Pontos" value={formatNumber(score)} />
        <StatCard label="WPM" value={wpm} />
        <StatCard label="Precisão" value={`${formatNumber(accuracy)}%`} />
        <StatCard
          label="Combo"
          value={`x${multiplier}`}
          sub={`${streak} seguidas`}
          tone={multiplier > 1 ? 'text-amber-300' : 'text-white'}
        />
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-linear-to-r from-indigo-400 to-emerald-400 transition-[width] duration-100 ease-linear"
          style={{ width: `${(remainingMs / totalMs) * 100}%` }}
        />
      </div>

      <div className="card mt-6 flex min-h-64 flex-col justify-center p-8 sm:p-10">
        {mode === 'keys' && <KeysView {...viewProps} />}
        {mode === 'words' && <WordsView {...viewProps} />}
        {mode === 'phrases' && <PhrasesView {...viewProps} />}
      </div>

      <p className="mt-4 h-5 text-center text-sm text-zinc-500">
        {status === 'ready' ? (
          <span className="animate-pulse text-indigo-300">Digite a primeira tecla para começar o cronômetro</span>
        ) : (
          <>
            Pressione <kbd>Esc</kbd> para voltar ao menu
          </>
        )}
      </p>

      <div className="mt-6 hidden md:block">
        <Keyboard expected={expected} lastKey={lastKey} />
      </div>
    </section>
  )
}

function KeysView({ current, upcoming, index, pos, mistakes, lastKey }) {
  const wrong = mistakes.includes(pos)
  const shake = Boolean(lastKey && !lastKey.ok)
  return (
    <div className="flex flex-col items-center gap-8">
      <div
        // key nova a cada tecla/erro para reiniciar a animação
        key={shake ? `shake-${lastKey.n}` : `item-${index}`}
        className={`flex size-32 items-center justify-center rounded-3xl border-2 font-mono text-6xl font-bold shadow-2xl sm:size-40 sm:text-7xl ${
          wrong
            ? 'border-rose-400 bg-rose-500/15 text-rose-200'
            : 'border-indigo-400/70 bg-indigo-500/10 text-white'
        } ${shake ? 'animate-shake' : 'animate-pop'}`}
      >
        {current}
      </div>
      <div className="flex items-center gap-3 font-mono text-2xl text-zinc-600">
        <span className="mr-1 text-xs uppercase tracking-widest text-zinc-500">próximas</span>
        {upcoming.map((k, i) => (
          <span key={i} className="flex size-10 items-center justify-center rounded-lg border border-white/10">
            {k}
          </span>
        ))}
      </div>
    </div>
  )
}

function WordsView({ current, upcoming, pos, mistakes, lastKey }) {
  return (
    <div
      className="flex items-baseline gap-8 overflow-hidden whitespace-nowrap"
      style={{ maskImage: 'linear-gradient(to right, black 55%, transparent 100%)' }}
    >
      <TypingText
        text={current}
        pos={pos}
        mistakes={mistakes}
        lastKey={lastKey}
        className="text-5xl font-semibold sm:text-6xl"
      />
      {upcoming.map((w, i) => (
        <span key={i} className="font-mono text-3xl text-zinc-600">
          {w}
        </span>
      ))}
    </div>
  )
}

function PhrasesView({ current, upcoming, pos, mistakes, lastKey }) {
  return (
    <div className="space-y-6">
      <TypingText
        text={current}
        pos={pos}
        mistakes={mistakes}
        lastKey={lastKey}
        className="text-2xl leading-relaxed sm:text-3xl"
      />
      {upcoming[0] && <p className="font-mono leading-relaxed text-zinc-600">{upcoming[0]}</p>}
    </div>
  )
}
