// Lógica do jogo, pura e sem dependência de React: fácil de testar.

export const POINTS_PER_CHAR = 10 // pontos por caractere correto (x multiplicador)
export const BONUS_PER_CHAR = 5 // bônus por caractere ao concluir um item sem erros
export const COMBO_STEPS = [0, 10, 25, 50] // sequência necessária para x1, x2, x3, x4

/** Multiplicador de pontos para uma sequência de acertos. */
export function multiplierFor(streak) {
  let multiplier = 1
  COMBO_STEPS.forEach((step, i) => {
    if (streak >= step) multiplier = i + 1
  })
  return multiplier
}

export const initialState = {
  status: 'menu', // 'menu' | 'ready' | 'running' | 'finished'
  mode: 'words', // 'keys' | 'words' | 'phrases'
  duration: 60, // segundos
  items: [], // fila do que precisa ser digitado
  index: 0, // item atual
  pos: 0, // caracteres já acertados no item atual
  mistakes: [], // posições do item atual em que houve erro
  score: 0,
  correct: 0, // teclas corretas
  errors: 0, // teclas erradas
  streak: 0, // acertos seguidos
  bestStreak: 0,
  completed: 0, // itens concluídos
  flawless: 0, // itens concluídos sem erro
  startedAt: null, // timestamp (ms) da primeira tecla
  elapsed: 0, // ms decorridos
  lastKey: null, // { key, ok, n } — feedback da última tecla
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    case 'SET_DURATION':
      return { ...state, duration: action.duration }
    case 'MENU':
      return { ...state, status: 'menu' }
    case 'SETUP':
      return {
        ...initialState,
        mode: action.mode ?? state.mode,
        duration: action.duration ?? state.duration,
        items: action.items,
        status: 'ready',
      }
    case 'APPEND_ITEMS':
      return { ...state, items: [...state.items, ...action.items] }
    case 'TICK':
      return tick(state, action.now)
    case 'KEY':
      return handleKey(state, action.key, action.now)
    default:
      return state
  }
}

function tick(state, now) {
  if (state.status !== 'running') return state
  const elapsed = now - state.startedAt
  const limit = state.duration * 1000
  if (elapsed >= limit) return { ...state, elapsed: limit, status: 'finished' }
  return { ...state, elapsed }
}

function handleKey(state, key, now) {
  if (state.status === 'ready') {
    // o cronômetro só começa na primeira tecla
    state = { ...state, status: 'running', startedAt: now, elapsed: 0 }
  } else if (state.status !== 'running') {
    return state
  }

  const target = state.items[state.index]
  if (target == null) return state

  const n = (state.lastKey?.n ?? 0) + 1

  if (key !== target[state.pos]) {
    const mistakes = state.mistakes.includes(state.pos)
      ? state.mistakes
      : [...state.mistakes, state.pos]
    return {
      ...state,
      errors: state.errors + 1,
      streak: 0,
      mistakes,
      lastKey: { key, ok: false, n },
    }
  }

  const streak = state.streak + 1
  let score = state.score + POINTS_PER_CHAR * multiplierFor(streak)
  let { index, mistakes, completed, flawless } = state
  let pos = state.pos + 1

  if (pos >= target.length) {
    completed += 1
    if (mistakes.length === 0) {
      flawless += 1
      score += BONUS_PER_CHAR * target.length
    }
    index += 1
    pos = 0
    mistakes = []
  }

  return {
    ...state,
    score,
    pos,
    index,
    mistakes,
    completed,
    flawless,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    correct: state.correct + 1,
    lastKey: { key, ok: true, n },
  }
}
