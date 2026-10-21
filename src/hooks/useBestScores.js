import { useCallback, useRef, useState } from 'react'

const STORAGE_KEY = 'teclando:bests'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function save(bests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bests))
  } catch {
    // armazenamento indisponível (modo privado etc.): o jogo segue sem recordes
  }
}

/** Recordes por modo/duração, persistidos no localStorage. */
export function useBestScores() {
  const [bests, setBests] = useState(load)
  const ref = useRef(bests)

  /** Registra o resultado e devolve `true` se for um novo recorde. */
  const record = useCallback((key, result) => {
    const previous = ref.current[key]
    const isNew = !previous || result.score > previous.score
    if (isNew) {
      ref.current = { ...ref.current, [key]: result }
      setBests(ref.current)
      save(ref.current)
    }
    return isNew
  }, [])

  return { bests, record }
}
