import { createContext, useContext, createSignal, onMount } from 'solid-js'

const TelegramContext = createContext()

export function TelegramProvider(props) {
  const [user, setUser] = createSignal(null)
  const [isReady, setIsReady] = createSignal(false)

  const sendData = (data) => {
    console.log('📱 Отправка данных:', data)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data))
    } else {
      console.log('🔧 Режим разработки - данные не отправлены')
    }
  }

  const showAlert = (message) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message, callback) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, callback)
    } else {
      const result = confirm(message)
      callback(result)
    }
  }

  const showMainButton = () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.show()
    }
  }
  
  const hideMainButton = () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide()
    }
  }

  onMount(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      setUser(tg.initDataUnsafe?.user || null)
      setIsReady(true)
      console.log('✅ Telegram WebApp готов:', tg.initDataUnsafe)
    } else {
      // Режим разработки
      setUser({
        id: 12345,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      })
      setIsReady(true)
      console.log('🔧 Режим разработки - используются тестовые данные')
    }
  })

  const contextValue = {
    user,
    isReady,
    sendData,
    showAlert,
    showConfirm,
    showMainButton,
    hideMainButton
  }

  return (
    <TelegramContext.Provider value={contextValue}>
      {props.children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
