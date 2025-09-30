import { useNavigate } from '@solidjs/router'
import { useTelegram } from '../context/TelegramContext.jsx'
import { createSignal } from 'solid-js'

export default function Settings() {
  const navigate = useNavigate()
  const { tg } = useTelegram()
  const [notifications, setNotifications] = createSignal(true)
  const [theme, setTheme] = createSignal('auto')

  const saveSettings = () => {
    if (tg) {
      tg.sendData(JSON.stringify({
        type: 'settings',
        notifications: notifications(),
        theme: theme()
      }))
      tg.showAlert('Настройки сохранены!')
    }
  }

  const closeApp = () => {
    if (tg) {
      tg.close()
    }
  }

  return (
    <div class="page">
      <h1>Настройки</h1>
      
      <div class="settings-form">
        <div class="setting-item">
          <label>
            <input 
              type="checkbox" 
              checked={notifications()}
              onChange={(e) => setNotifications(e.currentTarget.checked)}
            />
            Уведомления
          </label>
        </div>

        <div class="setting-item">
          <label>
            Тема:
            <select 
              value={theme()}
              onChange={(e) => setTheme(e.currentTarget.value)}
            >
              <option value="auto">Автоматическая</option>
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
            </select>
          </label>
        </div>
      </div>

      <div class="actions">
        <button onClick={saveSettings}>
          Сохранить
        </button>
        
        <button onClick={() => navigate('/')}>
          Назад
        </button>
        
        <button onClick={closeApp} class="close-btn">
          Закрыть приложение
        </button>
      </div>
    </div>
  )
}
