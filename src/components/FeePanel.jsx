import { createSignal, createMemo, createEffect, onMount, Show } from 'solid-js'

export default function FeePanel(props) {
  const [mode, setMode] = createSignal('percent')
  const [marginPct, setMarginPct] = createSignal(1.5) // дефолт 1.5%
  const [fixedFee, setFixedFee] = createSignal(0)

  const LS_KEY = 'currency-converter-fee-settings'

  // Загрузка настроек из localStorage
  onMount(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const settings = JSON.parse(saved)
        if (settings?.mode === 'percent' || settings?.mode === 'fixed') {
          setMode(settings.mode)
        }
        if (typeof settings?.marginPct === 'number') {
          setMarginPct(Math.max(0, Math.min(5, settings.marginPct)))
        }
        if (typeof settings?.fixedFee === 'number') {
          setFixedFee(Math.max(0, settings.fixedFee))
        }
      }
    } catch (error) {
      console.warn('Ошибка загрузки настроек комиссии:', error)
    }
  })

  // Сохранение настроек
  createEffect(() => {
    const settings = {
      mode: mode(),
      marginPct: marginPct(),
      fixedFee: fixedFee()
    }
    localStorage.setItem(LS_KEY, JSON.stringify(settings))
  })

  // Вычисления
  const cleanTotal = createMemo(() => {
    const amount = props.amount || 0
    const rate = props.rate() || 0
    return amount * rate
  })

  const totalWithPercent = createMemo(() => {
    return cleanTotal() * (1 + marginPct() / 100)
  })

  const totalWithFixed = createMemo(() => {
    return cleanTotal() + Math.max(0, fixedFee())
  })

  const totalWithFee = createMemo(() => {
    return mode() === 'percent' ? totalWithPercent() : totalWithFixed()
  })

  const effectiveRate = createMemo(() => {
    const amount = props.amount || 0
    return amount > 0 ? totalWithFee() / amount : (props.rate() || 0)
  })

  const feeAmount = createMemo(() => {
    return Math.max(0, totalWithFee() - cleanTotal())
  })

  // Получение флагов валют
  const getCurrencyFlag = (currencyCode) => {
    const flags = {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'RUB': '🇷🇺', 'GBP': '🇬🇧', 
      'JPY': '🇯🇵', 'CNY': '🇨🇳', 'CAD': '🇨🇦', 'AUD': '🇦🇺',
      'CHF': '🇨🇭', 'SEK': '🇸🇪'
    }
    return flags[currencyCode] || '💰'
  }

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat('ru-RU', { 
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals 
    }).format(num || 0)
  }

  const formatRate = (rate) => {
    return new Intl.NumberFormat('ru-RU', { 
      maximumFractionDigits: 6,
      minimumFractionDigits: 4 
    }).format(rate || 0)
  }

  return (
    <div class="fee-panel">
      <div class="fee-header">
        <h3>💳 Комиссия обменника</h3>
        <p class="fee-description">
          Посмотрите сколько получите с учетом комиссии реального обменника
        </p>
      </div>

      <div class="fee-mode-selector">
        <label class="fee-mode-option">
          <input
            type="radio"
            name="fee-mode"
            checked={mode() === 'percent'}
            onChange={() => setMode('percent')}
          />
          <span class="fee-mode-label">📊 Процент</span>
        </label>
        
        <label class="fee-mode-option">
          <input
            type="radio"
            name="fee-mode"
            checked={mode() === 'fixed'}
            onChange={() => setMode('fixed')}
          />
          <span class="fee-mode-label">
            💰 Фикс ({getCurrencyFlag(props.toCurrency)} {props.toCurrency})
          </span>
        </label>
      </div>

      <Show when={mode() === 'percent'}>
        <div class="fee-slider-section">
          <div class="fee-slider-header">
            <span class="fee-slider-label">Комиссия: {marginPct().toFixed(1)}%</span>
            <span class="fee-slider-range">0% — 5%</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={marginPct()}
            onInput={(e) => setMarginPct(Number(e.target.value))}
            class="fee-slider"
          />
          <div class="fee-slider-marks">
            <span>0%</span>
            <span>1%</span>
            <span>2%</span>
            <span>3%</span>
            <span>4%</span>
            <span>5%</span>
          </div>
        </div>
      </Show>

      <Show when={mode() === 'fixed'}>
        <div class="fee-fixed-section">
          <label class="fee-fixed-label">
            Фиксированная комиссия в {props.toCurrency}:
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={fixedFee()}
            onInput={(e) => setFixedFee(Number(e.target.value) || 0)}
            placeholder={`0.00 ${props.toCurrency}`}
            class="fee-fixed-input"
          />
        </div>
      </Show>

      <div class="fee-comparison">
        <div class="fee-card clean">
          <div class="fee-card-header">
            <h4>📈 Биржевой курс</h4>
            <span class="fee-card-subtitle">
              {getCurrencyFlag(props.fromCurrency)} {props.amount || 0} {props.fromCurrency} → {getCurrencyFlag(props.toCurrency)} {props.toCurrency}
            </span>
          </div>
          <div class="fee-card-content">
            <div class="fee-row">
              <span class="fee-label">Курс:</span>
              <span class="fee-value">{formatRate(props.rate)} {props.toCurrency}</span>
            </div>
            <div class="fee-row fee-total">
              <span class="fee-label">Получите:</span>
              <span class="fee-value">
                {getCurrencyFlag(props.toCurrency)} {formatNumber(cleanTotal())} {props.toCurrency}
              </span>
            </div>
          </div>
        </div>

        <div class="fee-card exchange">
          <div class="fee-card-header">
            <h4>🏪 У обменника</h4>
            <span class="fee-card-subtitle">
              {getCurrencyFlag(props.fromCurrency)} {props.amount || 0} {props.fromCurrency} → {getCurrencyFlag(props.toCurrency)} {props.toCurrency}
            </span>
          </div>
          <div class="fee-card-content">
            <div class="fee-row">
              <span class="fee-label">Эффективный курс:</span>
              <span class="fee-value">{formatRate(effectiveRate())} {props.toCurrency}</span>
            </div>
            <div class="fee-row">
              <span class="fee-label">Комиссия:</span>
              <span class="fee-value fee-amount">
                {getCurrencyFlag(props.toCurrency)} {formatNumber(feeAmount())} {props.toCurrency}
              </span>
            </div>
            <div class="fee-row fee-total">
              <span class="fee-label">Получите:</span>
              <span class="fee-value">
                {getCurrencyFlag(props.toCurrency)} {formatNumber(totalWithFee())} {props.toCurrency}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="fee-footer">
        <small>
          ℹ️ Расчет основан на текущем курсе API. Реальные комиссии обменников могут отличаться.
        </small>
      </div>
    </div>
  )
}