import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

export default function CurrencyBoard() {
  const [rates, setRates] = createSignal({})
  const [loading, setLoading] = createSignal(true)
  const [lastUpdate, setLastUpdate] = createSignal('')
  const [nextUpdate, setNextUpdate] = createSignal(0)
  const [timeUntilUpdate, setTimeUntilUpdate] = createSignal(0)

  // Популярные валюты для табло
  const popularCurrencies = [
    { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
    { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
    { code: 'GBP', name: 'Британский фунт', flag: '🇬🇧' },
    { code: 'JPY', name: 'Японская йена', flag: '🇯🇵' }
  ]

  // Загрузка курсов валют через ExchangeRate API
  const loadExchangeRates = async () => {
    try {
      setLoading(true)
      
      const apiKey = 'ddc693307c11cd02d9ad0945'
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.result !== 'success') {
        throw new Error('API returned error result')
      }
      
      // Используем реальные курсы из API
      setRates(data.conversion_rates)
      setLastUpdate(data.time_last_update_utc)
      
      // Вычисляем время до следующего обновления
      const nextUpdateTime = new Date(data.time_next_update_unix * 1000)
      const now = new Date()
      const secondsUntilUpdate = Math.max(0, Math.floor((nextUpdateTime - now) / 1000))
      setNextUpdate(secondsUntilUpdate)
      setTimeUntilUpdate(secondsUntilUpdate)
      
    } catch (error) {
      console.error('Ошибка загрузки курсов для табло:', error)
      
      // Fallback на mock данные при ошибке API
      const mockRates = {
        USD: 1.0,
        EUR: 0.85,
        RUB: 95.50,
        GBP: 0.75,
        JPY: 150.25
      }
      
      setRates(mockRates)
      setLastUpdate(new Date().toISOString())
      setNextUpdate(300)
      setTimeUntilUpdate(300)
    } finally {
      setLoading(false)
    }
  }

  // Обратный отсчет до следующего обновления
  const startCountdown = () => {
    const timer = setInterval(() => {
      setTimeUntilUpdate(prev => {
        const newTime = Math.max(0, prev - 1)
        if (newTime === 0) {
          // Автоматическое обновление курсов
          loadExchangeRates()
        }
        return newTime
      })
    }, 1000)

    onCleanup(() => clearInterval(timer))
  }

  // Форматирование времени в часы:минуты:секунды
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м ${secs}с`
    } else if (minutes > 0) {
      return `${minutes}м ${secs}с`
    } else {
      return `${secs}с`
    }
  }

  // Форматирование даты последнего обновления
  const formatLastUpdate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    } catch (error) {
      return dateString
    }
  }

  // Получить курс валюты к рублю
  const getCurrencyToRub = (currencyCode) => {
    const currentRates = rates()
    if (!currentRates || !currentRates[currencyCode] || !currentRates['RUB']) {
      return 0
    }
    
    // Курс валюты к рублю
    const rate = currentRates['RUB'] / currentRates[currencyCode]
    return Math.round(rate * 100) / 100
  }

  onMount(() => {
    loadExchangeRates()
    startCountdown()
  })

  return (
    <div class="currency-board">
      <div class="board-header">
        <h2>📊 Курсы валют к рублю</h2>
      </div>

      {loading() ? (
        <div class="board-loading">
          <div class="spinner">⏳</div>
          <p>Загружаем курсы валют...</p>
        </div>
      ) : (
        <div class="currency-grid">
          {popularCurrencies.map(currency => {
            const rate = getCurrencyToRub(currency.code)
            return (
              <div class="currency-card" key={currency.code}>
                <div class="currency-header">
                  <span class="currency-flag">{currency.flag}</span>
                  <span class="currency-code">{currency.code}</span>
                </div>
                <div class="currency-rate">
                  {rate > 0 ? (
                    <>
                      <span class="rate-value">{rate}</span>
                      <span class="rate-currency">₽</span>
                    </>
                  ) : (
                    <span class="rate-loading">...</span>
                  )}
                </div>
                <div class="currency-name">{currency.name}</div>
              </div>
            )
          })}
        </div>
      )}

      <div class="board-footer">
        <button 
          onClick={loadExchangeRates} 
          class="update-button" 
          disabled={loading()}
        >
          🔄 Обновить курсы
        </button>
      </div>
    </div>
  )
}