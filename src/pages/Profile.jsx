import { useNavigate } from '@solidjs/router'
import { useTelegram } from '../context/TelegramContext.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const { user, themeParams } = useTelegram()

  return (
    <div class="page">
      <h1>Профиль пользователя</h1>
      
      {user ? (
        <div class="profile-info">
          <div class="avatar">
            {user.photo_url && (
              <img src={user.photo_url} alt="Avatar" />
            )}
          </div>
          
          <div class="user-details">
            <h2>{user.first_name} {user.last_name || ''}</h2>
            {user.username && <p>@{user.username}</p>}
            <p>ID: {user.id}</p>
            <p>Язык: {user.language_code}</p>
            {user.is_premium && <p>⭐ Premium пользователь</p>}
          </div>
        </div>
      ) : (
        <p>Информация о пользователе недоступна</p>
      )}

      <div class="actions">
        <button onClick={() => navigate('/')}>
          Назад
        </button>
        
        <button onClick={() => navigate('/settings')}>
          Настройки
        </button>
      </div>
    </div>
  )
}
