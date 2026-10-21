import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BONUS_PER_CHAR,
  POINTS_PER_CHAR,
  initialState,
  multiplierFor,
  reducer,
} from '../src/game/reducer.js'
import { computeAccuracy, computeWpm } from '../src/game/stats.js'

const setup = (items) => reducer(initialState, { type: 'SETUP', items, mode: 'words', duration: 60 })
const type = (state, keys, now = 0) =>
  [...keys].reduce((s, key) => reducer(s, { type: 'KEY', key, now }), state)

test('a partida começa na primeira tecla', () => {
  const ready = setup(['ab', 'c'])
  assert.equal(ready.status, 'ready')

  const s = reducer(ready, { type: 'KEY', key: 'a', now: 1000 })
  assert.equal(s.status, 'running')
  assert.equal(s.startedAt, 1000)
  assert.equal(s.pos, 1)
  assert.equal(s.correct, 1)
  assert.equal(s.score, POINTS_PER_CHAR)
})

test('erro não avança, zera o combo e marca a posição', () => {
  const s = type(setup(['ab']), 'ax')
  assert.equal(s.pos, 1)
  assert.equal(s.errors, 1)
  assert.equal(s.streak, 0)
  assert.deepEqual(s.mistakes, [1])
  assert.equal(s.lastKey.ok, false)
})

test('concluir um item sem erros dá bônus; com erros não', () => {
  const s = type(setup(['ab', 'c']), 'axbc')
  assert.equal(s.index, 2)
  assert.equal(s.pos, 0)
  assert.equal(s.completed, 2)
  assert.equal(s.flawless, 1)
  // 3 acertos + bônus apenas do item "c"
  assert.equal(s.score, 3 * POINTS_PER_CHAR + BONUS_PER_CHAR * 1)
  assert.deepEqual(s.mistakes, [])
})

test('o tempo encerra a partida e teclas depois são ignoradas', () => {
  let s = type(setup(['abc']), 'ab', 0)
  s = reducer(s, { type: 'TICK', now: 30_000 })
  assert.equal(s.status, 'running')
  assert.equal(s.elapsed, 30_000)

  s = reducer(s, { type: 'TICK', now: 60_500 })
  assert.equal(s.status, 'finished')
  assert.equal(s.elapsed, 60_000)

  const after = reducer(s, { type: 'KEY', key: 'c', now: 61_000 })
  assert.equal(after, s)
})

test('o multiplicador cresce com a sequência de acertos', () => {
  assert.equal(multiplierFor(0), 1)
  assert.equal(multiplierFor(9), 1)
  assert.equal(multiplierFor(10), 2)
  assert.equal(multiplierFor(24), 2)
  assert.equal(multiplierFor(25), 3)
  assert.equal(multiplierFor(50), 4)
  assert.equal(multiplierFor(999), 4)
})

test('SETUP preserva modo e duração escolhidos no menu', () => {
  let s = reducer(initialState, { type: 'SET_MODE', mode: 'phrases' })
  s = reducer(s, { type: 'SET_DURATION', duration: 30 })
  s = reducer(s, { type: 'SETUP', items: ['x'] })
  assert.equal(s.mode, 'phrases')
  assert.equal(s.duration, 30)
})

test('estatísticas: WPM e precisão', () => {
  assert.equal(computeWpm(300, 60_000), 60)
  assert.equal(computeWpm(0, 0), 0)
  assert.equal(computeWpm(10, 1_000, 5_000), 24) // piso de 5 s suaviza o início
  assert.equal(computeAccuracy(0, 0), 100)
  assert.equal(computeAccuracy(3, 1), 75)
  assert.equal(computeAccuracy(2, 1), 66.7)
})
