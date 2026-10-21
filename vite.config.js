import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Escuta no loopback IPv4: em alguns Windows "localhost" resolve só para ::1,
// o Vite sobe apenas em IPv6 e o navegador não encontra o servidor.
const host = '127.0.0.1'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // caminhos relativos: funciona no GitHub Pages com qualquer nome de repositório
  base: './',
  server: { host },
  preview: { host },
})
