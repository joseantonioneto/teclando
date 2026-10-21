import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { initialState, reducer } from './game/reducer'
import { computeAccuracy, computeWpm } from './game/stats'
import { generateItems } from './data/content'
import { useBestScores } from './hooks/useBestScores'
import WelcomeScreen from './components/WelcomeScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'

const BATCH_SIZE = 40 // itens gerados por vez
const MIN_AHEAD = 8 // gera mais itens quando restarem menos que isso na fila
const TICK_MS = 100
const WPM_MIN_ELAPSED_MS = 5000 // suaviza o WPM ao vivo nos primeiros segundos

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { status, mode, duration } = state
  const { bests, record } = useBestScores()
  const [newRecord, setNewRecord] = useState(false)
  const recorded = useRef(false)

  const bestKey = `${mode}-${duration}`
  const best = bests[bestKey]
  const wpm = computeWpm(state.correct, state.elapsed, status === 'finished' ? 0 : WPM_MIN_ELAPSED_MS)
  const accuracy = computeAccuracy(state.correct, state.errors)

  const start = useCallback(() => {
    // tira o foco de botões para que Espaço/Enter não os acionem durante o jogo
    document.activeElement?.blur?.()
    setNewRecord(false)
    dispatch({ type: 'SETUP', items: generateItems(mode, BATCH_SIZE) })
  }, [mode])

  const goToMenu = useCallback(() => dispatch({ type: 'MENU' }), [])

  // Captura do teclado em tempo real
  useEffect(() => {
    function onKeyDown(e) {
      // ignora repetição automática e atalhos do navegador (Ctrl+Alt = AltGr, permitido)
      if (e.repeat || e.metaKey || (e.ctrlKey && !e.altKey)) return
      const { key } = e

      if (status === 'menu') {
        if (key === 'Enter') {
          e.preventDefault()
          start()
        }
        return
      }

      if (status === 'finished') {
        if (key === 'Enter') {
          e.preventDefault()
          start()
        } else if (key === 'Escape') {
          goToMenu()
        }
        return
      }

      if (key === 'Escape') {
        goToMenu()
        return
      }
      if (key.length !== 1) return // Shift, Dead (acentos), F5, Tab etc.

      e.preventDefault()
      dispatch({ type: 'KEY', key, now: Date.now() })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [status, start, goToMenu])

  // Cronômetro
  useEffect(() => {
    if (status !== 'running') return
    const id = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), TICK_MS)
    return () => clearInterval(id)
  }, [status])

  // Mantém a fila de itens abastecida
  const remaining = state.items.length - state.index
  useEffect(() => {
    if ((status === 'ready' || status === 'running') && remaining < MIN_AHEAD) {
      const last = state.items[state.items.length - 1]
      dispatch({ type: 'APPEND_ITEMS', items: generateItems(mode, BATCH_SIZE, last) })
    }
  }, [status, remaining, mode, state.items])

  // Salva o recorde ao terminar a partida
  useEffect(() => {
    if (status !== 'finished') {
      recorded.current = false
      return
    }
    if (recorded.current) return
    recorded.current = true
    setNewRecord(record(bestKey, { score: state.score, wpm, accuracy }))
  }, [status, bestKey, state.score, wpm, accuracy, record])

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
      {status === 'menu' && (
        <WelcomeScreen
          mode={mode}
          duration={duration}
          best={best}
          onModeChange={(m) => dispatch({ type: 'SET_MODE', mode: m })}
          onDurationChange={(d) => dispatch({ type: 'SET_DURATION', duration: d })}
          onStart={start}
        />
      )}
      {(status === 'ready' || status === 'running') && (
        <GameScreen state={state} wpm={wpm} accuracy={accuracy} />
      )}
      {status === 'finished' && (
        <ResultsScreen
          state={state}
          wpm={wpm}
          accuracy={accuracy}
          newRecord={newRecord}
          best={best}
          onRestart={start}
          onMenu={goToMenu}
        />
      )}
    </main>
  )
}
