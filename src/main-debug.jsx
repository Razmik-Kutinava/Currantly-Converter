import { render } from 'solid-js/web'

console.log('🚀 main.jsx запущен')

const root = document.getElementById('root')
if (root) {
  try {
    console.log('🔧 Попытка рендера простого компонента')
    
    function SimpleApp() {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: '100vh'
        }}>
          <h1>💱 Конвертер валют</h1>
          <p>✅ SolidJS загружен успешно!</p>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <h2>🧪 Тестовый режим</h2>
            <p>Приложение работает в режиме отладки</p>
          </div>
          <button 
            style={{
              padding: '12px 24px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={() => alert('✅ Кнопка работает!')}
          >
            🧪 Тест кнопки
          </button>
        </div>
      )
    }
    
    render(() => <SimpleApp />, root)
    console.log('✅ Простое приложение отрендерено успешно')
    
  } catch (error) {
    console.error('❌ Ошибка рендера:', error)
    root.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial; background: #f44336; color: white; min-height: 100vh;">
        <h1>❌ Ошибка загрузки</h1>
        <p>SolidJS не смог запуститься</p>
        <pre style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; text-align: left; overflow: auto;">
${error.toString()}
${error.stack || ''}
        </pre>
        <button onclick="location.reload()" style="padding: 10px 20px; background: white; color: #f44336; border: none; border-radius: 5px; margin-top: 20px; cursor: pointer;">
          🔄 Перезагрузить
        </button>
      </div>
    `
  }
} else {
  console.error('❌ Элемент #root не найден в DOM')
}