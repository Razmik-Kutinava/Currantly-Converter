import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

export default function CurrencyConverter() {
  // Telegram Web App интеграция
  const sendData = (data) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data))
    }
  }
  
  const showAlert = (msg) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(msg)
    } else {
      alert(msg)
    }
  }

  // Состояние конвертера
  const [rates, setRates] = createSignal({})
  const [loading, setLoading] = createSignal(true)
  const [updating, setUpdating] = createSignal(false)
  const [amount, setAmount] = createSignal('100')
  const [fromCurrency, setFromCurrency] = createSignal('USD')
  const [toCurrency, setToCurrency] = createSignal('RUB')
  const [result, setResult] = createSignal(0)
  const [lastUpdate, setLastUpdate] = createSignal('')
  const [nextUpdate, setNextUpdate] = createSignal(60)
  const [apiStatus, setApiStatus] = createSignal('offline')

  // Загрузка курсов валют через ExchangeRate API
  const loadExchangeRates = async (isAutoUpdate = false) => {
    try {
      if (isAutoUpdate) {
        setUpdating(true)
      } else {
        setLoading(true)
      }
      
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
      
      setRates(data.conversion_rates)
      setLastUpdate(data.time_last_update_utc)
      setApiStatus('online')
      
      const nextUpdateTime = new Date(data.time_next_update_unix * 1000)
      const now = new Date()
      const secondsUntilUpdate = Math.max(0, Math.floor((nextUpdateTime - now) / 1000))
      setNextUpdate(secondsUntilUpdate)
      
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error)
      
      const mockRates = {
        USD: 1.0, EUR: 0.85, RUB: 95.50, GBP: 0.75, JPY: 150.25,
        CNY: 7.30, CAD: 1.35, AUD: 1.55, CHF: 0.92, SEK: 11.20
      }
      
      setRates(mockRates)
      setLastUpdate(new Date().toISOString())
      setNextUpdate(300)
      setApiStatus('offline')
      
      if (!isAutoUpdate) {
        showAlert('Используются офлайн курсы. Проверьте подключение к интернету.')
      }
    } finally {
      setLoading(false)
      setUpdating(false)
    }
  }

  // Конвертация валют
  const convertCurrency = () => {
    const ratesData = rates()
    const amountNum = parseFloat(amount()) || 0
    
    if (!ratesData || Object.keys(ratesData).length === 0) {
      setResult(0)
      return
    }
    
    if (!ratesData[fromCurrency()] || !ratesData[toCurrency()]) {
      setResult(0)
      return
    }

    const fromRate = ratesData[fromCurrency()]
    const toRate = ratesData[toCurrency()]
    const usdAmount = amountNum / fromRate
    const resultAmount = usdAmount * toRate
    
    setResult(Math.round(resultAmount * 100) / 100)
  }

  // Автоматическая конвертация при изменении параметров
  createEffect(() => {
    const ratesData = rates()
    if (ratesData && Object.keys(ratesData).length > 0) {
      convertCurrency()
    }
  })

  // Переключение валют местами
  const swapCurrencies = () => {
    const tempFrom = fromCurrency()
    setFromCurrency(toCurrency())
    setToCurrency(tempFrom)
  }

  onMount(() => {
    loadExchangeRates()
  })

  // Получить список валют для селекта
  const getCurrencyOptions = () => {
    const currencies = [
      { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
      { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
      { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
      { code: 'GBP', name: 'Британский фунт', flag: '🇬🇧' },
      { code: 'JPY', name: 'Японская йена', flag: '🇯🇵' },
      { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳' },
      { code: 'CAD', name: 'Канадский доллар', flag: '🇨🇦' },
      { code: 'AUD', name: 'Австралийский доллар', flag: '🇦🇺' },
      { code: 'CHF', name: 'Швейцарский франк', flag: '🇨🇭' },
      { code: 'SEK', name: 'Шведская крона', flag: '🇸🇪' }
    ]
    return currencies
  }

  // Получить флаг валюты
  const getCurrencyFlag = (currencyCode) => {
    const currency = getCurrencyOptions().find(c => c.code === currencyCode)
    return currency?.flag || '💰'
  }

  return (
    <div class="currency-converter">
      <div class="converter-header">
        <h1>💱 Конвертер валют</h1>
        <p class="welcome-text">Привет! Конвертируй валюты легко и быстро!</p>
        
        <div class={`api-status api-status-${apiStatus()}`}>
          {apiStatus() === 'online' && (
            <>
              <span class="status-icon">🟢</span>
              <span class="status-text">Реальные курсы</span>
            </>
          )}
          {apiStatus() === 'offline' && (
            <>
              <span class="status-icon">🟡</span>
              <span class="status-text">Офлайн режим</span>
            </>
          )}
        </div>
      </div>

      {loading() ? (
        <div class="loading-state">
          <div class="spinner">⏳</div>
          <p>Загружаем актуальные курсы валют...</p>
        </div>
      ) : (
        <>
          <div class="amount-section">
            <label class="input-label">💰 Сумма для конвертации</label>
            <input
              type="number"
              value={amount()}
              onInput={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              class="amount-input"
              min="0"
              step="0.01"
            />
          </div>

          <div class="currency-section">
            <label class="input-label">🔄 Из валюты</label>
            <select
              value={fromCurrency()}
              onChange={(e) => setFromCurrency(e.target.value)}
              class="currency-select"
            >
              {getCurrencyOptions().map(currency => (
                <option value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div class="swap-section">
            <button onClick={swapCurrencies} class="swap-button" title="Поменять валюты местами">
              ⇅
            </button>
          </div>

          <div class="currency-section">
            <label class="input-label">➡️ В валюту</label>
            <select
              value={toCurrency()}
              onChange={(e) => setToCurrency(e.target.value)}
              class="currency-select"
            >
              {getCurrencyOptions().map(currency => (
                <option value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div class="result-section">
            <div class="result-card">
              <div class="result-header">📊 Результат конвертации</div>
              <div class="result-calculation">
                <div class="from-amount">
                  {getCurrencyFlag(fromCurrency())} {amount()} {fromCurrency()}
                </div>
                <div class="equals">=</div>
                <div class="to-amount">
                  {getCurrencyFlag(toCurrency())} {result() || '...'} {toCurrency()}
                </div>
              </div>
              {result() > 0 && rates()[fromCurrency()] && rates()[toCurrency()] && (
                <div class="exchange-rate">
                  1 {fromCurrency()} = {(rates()[toCurrency()] / rates()[fromCurrency()]).toFixed(4)} {toCurrency()}
                </div>
              )}
            </div>
          </div>

          <div class="quick-amounts">
            <div class="section-title">⚡ Быстрый расчет</div>
            <div class="quick-buttons">
              {['1', '10', '100', '1000'].map(value => (
                <button
                  onClick={() => setAmount(value)}
                  class={`quick-button ${amount() === value ? 'active' : ''}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div class="actions-section">
            <button onClick={loadExchangeRates} class="btn btn-outline" disabled={loading()}>
              🔄 Обновить курсы
            </button>
          </div>

          {lastUpdate() && (
            <div class="update-info">
              <div class="update-status">
                {updating() ? (
                  <span class="updating">🔄 Обновление курсов...</span>
                ) : (
                  <span>📅 Курсы обновлены: {lastUpdate()}</span>
                )}
              </div>
              <div class="next-update">
                ⏱️ Следующее обновление через: {nextUpdate()}с
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}