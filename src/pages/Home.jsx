import { createSignal, onMount } from 'solid-js'
import CurrencyConverter from '../components/CurrencyConverter.jsx'
import CurrencyBoard from '../components/CurrencyBoard.jsx'

export default function Home() {
  return (
    <div class="page">
      <CurrencyConverter />
      
      {/* Табло с популярными курсами валют */}
      <div class="currency-board-section">
        <CurrencyBoard />
      </div>
    </div>
  )
}
