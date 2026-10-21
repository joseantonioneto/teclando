import StatCard from './StatCard'
import { modeInfo } from '../data/content'
import { formatNumber } from '../game/stats'

function accuracyTone(accuracy) {
  if (accuracy >= 95) return 'text-emerald-400'
  if (accuracy >= 85) return 'text-amber-300'
  return 'text-rose-400'
}

export default function ResultsScreen({ state, wpm, accuracy, newRecord, best, onRestart, onMenu }) {
  const { mode, duration, score, correct, errors, bestStreak, completed, flawless } = state
  const info = modeInfo(mode)

  return (
    <section className="w-full max-w-3xl animate-pop">
      <header className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300/80">Fim de partida</p>
        <p className="mt-2 text-zinc-400">
          Modo {info.label} · {duration} s
        </p>
        {newRecord && (
          <p className="mt-3 inline-block animate-pop rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-sm font-semibold text-amber-300">
            🏆 Novo recorde!
          </p>
        )}
      </header>

      <div className="card p-6 sm:p-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Pontuação final</p>
          <p className="mt-2 bg-linear-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-6xl font-bold tabular-nums text-transparent sm:text-7xl">
            {formatNumber(score)}
          </p>
          {best && !newRecord && (
            <p className="mt-2 text-sm text-zinc-500">Recorde: {formatNumber(best.score)} pts</p>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Velocidade" value={`${wpm} WPM`} />
          <StatCard label="Precisão" value={`${formatNumber(accuracy)}%`} tone={accuracyTone(accuracy)} />
          <StatCard label="Melhor combo" value={bestStreak} sub="acertos seguidos" />
          <StatCard label="Acertos" value={formatNumber(correct)} tone="text-emerald-400" />
          <StatCard label="Erros" value={formatNumber(errors)} tone="text-rose-400" />
          <StatCard label={`${info.unit} concluídas`} value={completed} sub={`${flawless} sem erros`} />
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onRestart} className="btn-primary">
            Jogar novamente <kbd>Enter</kbd>
          </button>
          <button type="button" onClick={onMenu} className="btn-secondary">
            Menu <kbd>Esc</kbd>
          </button>
        </div>
      </div>
    </section>
  )
}
