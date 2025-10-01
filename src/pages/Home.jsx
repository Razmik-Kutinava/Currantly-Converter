import { createSignal, onMount } from 'solid-js'
import CurrencyConverter from '../components/CurrencyConverter.jsx'
import CurrencyBoard from '../components/CurrencyBoard.jsx'

export default function Home() {
  return (
    <div class="page">
      {/* Описание приложения */}
      <div class="app-description">
        <h1>💱 Конвертер валют</h1>
        <p>Быстрое и точное конвертирование валют с актуальными курсами в режиме реального времени.</p>
      </div>
      
      <CurrencyConverter />
      
      {/* Табло с популярными курсами валют */}
      <div class="currency-board-section">
        <CurrencyBoard />
      </div>
    </div>
  )
}
