import { render } from 'solid-js/web'
import App from './App.jsx'
import './index.css'

// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp
if (tg) {
  tg.ready()
  tg.expand()
}

// Обработка ошибок
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason)
})

const root = document.getElementById('root')
if (root) {
  try {
    render(() => <App />, root)
  } catch (error) {
    console.error('Ошибка запуска приложения:', error)
    root.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial; background: #f44336; color: white; min-height: 100vh;">
        <h1>⚠️ Ошибка загрузки приложения</h1>
        <p>Приложение не смогло запуститься. Проверьте консоль для деталей.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: white; color: #f44336; border: none; border-radius: 8px; cursor: pointer; margin: 10px;">
          🔄 Обновить страницу
        </button>
      </div>
    `
  }
} else {
  console.error('Элемент #root не найден')
}
