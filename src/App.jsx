import { createSignal, onMount } from 'solid-js'
import Home from './pages/Home.jsx'

function App() {
  const [isReady, setIsReady] = createSignal(false)

  onMount(() => {
    // Инициализация Telegram WebApp
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      setIsReady(true)
    } else {
      setIsReady(true)
    }
  })

  return (
    <div class="app">
      <Home />
    </div>
  )
}

export default App
