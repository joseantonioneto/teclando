# Teclando — Jogo de Digitação

> 🎮 Jogue online: **https://joseantonioneto.github.io/teclando/**

Jogo de digitação para o navegador, feito com **React 19 + Vite + Tailwind CSS v4**.
O jogo mostra teclas, palavras ou frases na tela; cada acerto vira pontos, e a partida
acompanha tempo, precisão (%) e velocidade (WPM) em tempo real.

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço mostrado no terminal: `http://127.0.0.1:5173` (o `http://localhost:5173` também funciona).
O servidor é fixado no loopback IPv4 em `vite.config.js` porque, em alguns Windows, `localhost`
resolve só para `::1`, o Vite sobe apenas em IPv6 e o navegador não encontra a página.

Outros comandos:

| Comando           | O que faz                                          |
| ----------------- | -------------------------------------------------- |
| `npm run build`   | Gera a versão de produção em `dist/`               |
| `npm run preview` | Serve a versão de produção localmente              |
| `npm test`        | Roda os testes da lógica do jogo (Node `--test`)   |

## Como jogar

1. Escolha o **modo** (Teclas, Palavras ou Frases) e a **duração** (15 a 120 s).
2. Clique em **Começar** ou pressione `Enter`.
3. O cronômetro só dispara na primeira tecla digitada.
4. Digite o que aparece na tela: verde = acerto, vermelho = erro. Uma tecla errada não
   avança — basta digitar a tecla certa para continuar.
5. Ao fim do tempo aparece a tela de resultados. `Enter` reinicia, `Esc` volta ao menu.

Precisa de um teclado físico (desktop/notebook). Acentos funcionam com as teclas mortas
do layout ABNT2 (`´` + `a` = `á`).

### Pontuação

- **+10 pontos** por caractere correto, multiplicado pelo combo.
- **Combo**: x2 a partir de 10 acertos seguidos, x3 com 25 e x4 com 50. Um erro zera o combo.
- **Bônus** de 5 pontos por caractere ao concluir uma palavra/frase/tecla sem nenhum erro.
- **WPM** = (caracteres corretos ÷ 5) ÷ minutos decorridos.
- **Precisão** = acertos ÷ (acertos + erros).

O melhor resultado de cada combinação modo + duração fica salvo no navegador (`localStorage`).

## Publicar no GitHub Pages

O workflow em `.github/workflows/deploy.yml` testa, compila e publica o `dist/` a cada push na
branch `main`. O `base: './'` em `vite.config.js` gera caminhos relativos, então funciona com
qualquer nome de repositório.

1. Crie um repositório **público** no GitHub (no plano Free, o Pages só funciona em repositórios públicos).
2. Envie o código:

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```

3. No GitHub, abra **Settings → Pages** e, em **Source**, escolha **GitHub Actions**.
4. Acompanhe a aba **Actions**; ao terminar, o jogo fica em `https://SEU-USUARIO.github.io/SEU-REPO/`.

## Estrutura

```
.github/workflows/deploy.yml   # publica no GitHub Pages a cada push
index.html
vite.config.js
src/
  main.jsx                 # ponto de entrada
  index.css                # Tailwind, tema, animações e classes utilitárias
  App.jsx                  # estado global, teclado, cronômetro e troca de telas
  game/
    reducer.js             # regras do jogo (puro, sem React)
    stats.js               # WPM, precisão e formatação
  data/
    content.js             # modos, durações, palavras e frases
  hooks/
    useBestScores.js       # recordes no localStorage
  components/
    WelcomeScreen.jsx      # tela inicial
    GameScreen.jsx         # partida (stats, texto-alvo, teclado virtual)
    ResultsScreen.jsx      # tela de resultados
    TypingText.jsx         # texto com feedback por caractere
    Keyboard.jsx           # teclado virtual
    StatCard.jsx
tests/
  reducer.test.js          # testes da lógica
```
