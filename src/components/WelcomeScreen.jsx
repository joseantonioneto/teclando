import { DURATIONS, MODES } from '../data/content'
import { formatNumber } from '../game/stats'

export default function WelcomeScreen({ mode, duration, best, onModeChange, onDurationChange, onStart }) {
  return (
    <section className="w-full max-w-3xl animate-pop">
      <header className="mb-10 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-indigo-300/80">Jogo de digitação</p>
        <h1 className="bg-linear-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Teclando
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-zinc-400">
          Digite o que aparece na tela o mais rápido e com a maior precisão possível. Cada acerto vale
          pontos e sequências sem erro multiplicam a pontuação.
        </p>
      </header>

      <div className="card p-6 sm:p-8">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Modo</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => onModeChange(m.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === m.id
                  ? 'border-indigo-400 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              <span className="block text-lg font-semibold">{m.label}</span>
              <span className="mt-1 block text-sm text-zinc-400">{m.description}</span>
            </button>
          ))}
        </div>

        <h2 className="mt-8 mb-3 text-xs uppercase tracking-widest text-zinc-500">Duração</h2>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={duration === d}
              onClick={() => onDurationChange(d)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                duration === d
                  ? 'border-indigo-400 bg-indigo-500/20 text-white'
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {d} s
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-400">
            {best ? (
              <>
                Seu recorde:{' '}
                <span className="font-semibold text-white">{formatNumber(best.score)} pts</span> ·{' '}
                {best.wpm} WPM · {formatNumber(best.accuracy)}%
              </>
            ) : (
              'Nenhum recorde ainda neste modo.'
            )}
          </p>
          <button type="button" onClick={onStart} className="btn-primary">
            Começar <kbd>Enter</kbd>
          </button>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
        <li>
          <span className="text-emerald-400">●</span> verde = acerto
        </li>
        <li>
          <span className="text-rose-400">●</span> vermelho = erro
        </li>
        <li>
          <kbd>Esc</kbd> volta ao menu
        </li>
      </ul>
    </section>
  )
}
