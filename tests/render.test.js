// Smoke test de renderização: carrega os componentes via Vite (SSR) e renderiza
// cada tela com react-dom/server, garantindo que nada quebra ao montar.
import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'
import { initialState } from '../src/game/reducer.js'

const root = fileURLToPath(new URL('..', import.meta.url))
let vite

test.before(async () => {
  vite = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
  })
})

test.after(async () => {
  await vite?.close()
})

async function load(id) {
  if (typeof vite.ssrLoadModule === 'function') return vite.ssrLoadModule(id)
  return vite.environments.ssr.runner.import(id)
}

// remove os separadores `<!-- -->` que o React insere entre nós de texto
const render = (Component, props) =>
  renderToString(createElement(Component, props)).replace(/<!--.*?-->/g, '')
const noop = () => {}

function expectAll(html, texts) {
  for (const text of texts) assert.ok(html.includes(text), `esperava encontrar "${text}"`)
}

test('tela inicial renderiza modos, durações e botão de início', async () => {
  const { default: App } = await load('/src/App.jsx')
  expectAll(render(App), ['Teclando', 'Teclas', 'Palavras', 'Frases', '15 s', '120 s', 'Começar'])
})

test('tela de jogo renderiza feedback por caractere em cada modo', async () => {
  const { default: GameScreen } = await load('/src/components/GameScreen.jsx')
  const base = {
    ...initialState,
    status: 'running',
    startedAt: 0,
    elapsed: 12_345,
    score: 120,
    streak: 12,
    pos: 2,
    mistakes: [1],
    lastKey: { key: 'x', ok: false, n: 3 },
  }
  const stats = { wpm: 30, accuracy: 90 }

  const phrases = render(GameScreen, { state: { ...base, mode: 'phrases', items: ['Olá mundo', 'Outra frase'] }, ...stats })
  expectAll(phrases, [
    'text-emerald-400', // acerto em verde
    'text-rose-400', // erro em vermelho
    'animate-shake', // animação da tecla errada
    '48s', // tempo restante arredondado para cima
    'x2', // multiplicador do combo com 12 acertos seguidos
    'Outra frase', // próxima frase visível
  ])

  const words = render(GameScreen, { state: { ...base, mode: 'words', items: ['casa', 'tempo', 'vida'] }, ...stats })
  expectAll(words, ['tempo', 'vida'])

  const keys = render(GameScreen, {
    state: { ...base, mode: 'keys', pos: 0, mistakes: [], lastKey: null, items: ['a', 'b', 'c', 'd'] },
    ...stats,
  })
  expectAll(keys, ['próximas', 'animate-pop'])
})

test('tela de resultados mostra pontuação final e novo recorde', async () => {
  const { default: ResultsScreen } = await load('/src/components/ResultsScreen.jsx')
  const state = {
    ...initialState,
    status: 'finished',
    mode: 'words',
    duration: 30,
    score: 1234,
    correct: 100,
    errors: 5,
    bestStreak: 40,
    completed: 20,
    flawless: 15,
    elapsed: 30_000,
  }
  const html = render(ResultsScreen, {
    state,
    wpm: 40,
    accuracy: 95.2,
    newRecord: true,
    best: { score: 1234 },
    onRestart: noop,
    onMenu: noop,
  })
  expectAll(html, ['1.234', '40 WPM', '95,2%', 'Novo recorde', 'palavras concluídas', '15 sem erros', 'Jogar novamente'])
})
