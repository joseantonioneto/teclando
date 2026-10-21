// Conteúdo dos modos de jogo: teclas, palavras e frases em português.

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
// letras aparecem 3x mais que dígitos
const KEY_POOL = LETTERS.repeat(3) + DIGITS

export const WORDS = [
  'casa', 'tempo', 'vida', 'dia', 'ano', 'pessoa', 'mundo', 'cidade', 'trabalho', 'forma',
  'parte', 'lugar', 'mão', 'hora', 'ponto', 'momento', 'água', 'terra', 'fogo', 'vento',
  'noite', 'manhã', 'tarde', 'semana', 'mês', 'livro', 'mesa', 'porta', 'janela', 'carro',
  'rua', 'praça', 'escola', 'amigo', 'família', 'filho', 'pai', 'mãe', 'irmão', 'nome',
  'ideia', 'história', 'música', 'cinema', 'teatro', 'festa', 'jogo', 'bola', 'campo', 'praia',
  'mar', 'rio', 'céu', 'sol', 'lua', 'estrela', 'nuvem', 'chuva', 'frio', 'calor',
  'verão', 'inverno', 'cor', 'azul', 'verde', 'vermelho', 'branco', 'preto', 'amarelo', 'grande',
  'pequeno', 'novo', 'velho', 'bom', 'melhor', 'forte', 'rápido', 'lento', 'fácil', 'difícil',
  'feliz', 'triste', 'alegre', 'calmo', 'longe', 'perto', 'cedo', 'sempre', 'nunca', 'agora',
  'depois', 'antes', 'hoje', 'amanhã', 'ontem', 'também', 'muito', 'pouco', 'mais', 'menos',
  'tudo', 'nada', 'alguém', 'ninguém', 'coisa', 'gente', 'povo', 'país', 'estado', 'governo',
  'direito', 'lei', 'justiça', 'empresa', 'mercado', 'dinheiro', 'preço', 'valor', 'conta', 'banco',
  'saúde', 'médico', 'hospital', 'remédio', 'corpo', 'cabeça', 'olho', 'boca', 'coração', 'braço',
  'perna', 'pé', 'cabelo', 'rosto', 'voz', 'palavra', 'frase', 'texto', 'letra', 'número',
  'pergunta', 'resposta', 'problema', 'solução', 'projeto', 'plano', 'meta', 'sonho', 'desejo', 'medo',
  'amor', 'paz', 'força', 'poder', 'luz', 'sombra', 'caminho', 'viagem', 'chegada', 'saída',
  'entrada', 'começo', 'fim', 'meio', 'centro', 'lado', 'cima', 'baixo', 'frente', 'dentro',
  'fora', 'teclado', 'tela', 'computador', 'mouse', 'internet', 'código', 'programa', 'sistema', 'dados',
  'arquivo', 'pasta', 'rede', 'sinal', 'energia', 'máquina', 'motor', 'roda', 'ponte', 'estrada',
  'trem', 'avião', 'barco', 'bicicleta', 'animal', 'cachorro', 'gato', 'pássaro', 'peixe', 'cavalo',
  'árvore', 'flor', 'folha', 'fruta', 'pão', 'café', 'leite', 'arroz', 'feijão', 'carne',
  'sal', 'açúcar', 'comida', 'bebida', 'prato', 'copo', 'faca', 'garfo', 'colher', 'cozinha',
  'quarto', 'sala', 'banheiro', 'jardim', 'quintal', 'parede', 'chão', 'escada', 'prédio', 'bairro',
  'mapa', 'rota', 'norte', 'sul', 'leste', 'oeste', 'chave', 'relógio', 'papel', 'caneta',
]

export const PHRASES = [
  'A prática leva à perfeição.',
  'Devagar se vai ao longe.',
  'O sol nasce para todos.',
  'Água mole em pedra dura, tanto bate até que fura.',
  'Digite com calma e atenção aos detalhes.',
  'Cada tecla certa vale pontos extras.',
  'O teclado é a extensão das suas ideias.',
  'Programar é a arte de resolver problemas.',
  'Uma linha de código por vez, sem pressa.',
  'A velocidade vem com a prática diária.',
  'Ler bons livros abre portas para novos mundos.',
  'Hoje é um ótimo dia para aprender algo novo.',
  'A música tem o poder de mudar o nosso humor.',
  'Pequenos passos levam a grandes conquistas.',
  'Respire fundo e continue digitando.',
  'Os erros fazem parte do aprendizado.',
  'Mantenha os dedos na posição inicial do teclado.',
  'A precisão é mais importante do que a velocidade.',
  'Um bom dia começa com um sorriso.',
  'O Brasil é conhecido por suas praias e florestas.',
  'A tecnologia muda a forma como vivemos.',
  'Escrever bem é pensar com clareza.',
  'O tempo voa quando estamos nos divertindo.',
  'Nunca é tarde para começar de novo.',
  'A paciência é uma virtude valiosa.',
  'Cada dia é uma nova oportunidade.',
  'Treine todos os dias por alguns minutos.',
  'A persistência transforma esforço em resultado.',
  'Olhe para a tela, não para o teclado.',
  'O silêncio da noite inspira grandes ideias.',
  'Ela plantou flores coloridas no jardim.',
  'O trem partiu da estação às oito horas.',
  'Nós vamos ao cinema no sábado à tarde.',
  'O gato dormiu o dia inteiro no sofá.',
  'Choveu forte durante toda a madrugada.',
  'Meu avô conta histórias incríveis sobre o mar.',
]

export const MODES = [
  { id: 'keys', label: 'Teclas', description: 'Uma tecla por vez. Bom para aquecer os dedos.', unit: 'teclas' },
  { id: 'words', label: 'Palavras', description: 'Palavras comuns do dia a dia, em sequência.', unit: 'palavras' },
  { id: 'phrases', label: 'Frases', description: 'Frases completas, com maiúsculas e pontuação.', unit: 'frases' },
]

export const DURATIONS = [15, 30, 60, 120]

export function modeInfo(id) {
  return MODES.find((m) => m.id === id)
}

function poolFor(mode) {
  if (mode === 'keys') return KEY_POOL
  if (mode === 'phrases') return PHRASES
  return WORDS
}

function randomFrom(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Gera `count` itens para o modo, sem repetir o mesmo item duas vezes seguidas. */
export function generateItems(mode, count, previous = null) {
  const pool = poolFor(mode)
  const items = []
  for (let i = 0; i < count; i++) {
    let item = randomFrom(pool)
    while (pool.length > 1 && item === previous) item = randomFrom(pool)
    items.push(item)
    previous = item
  }
  return items
}
