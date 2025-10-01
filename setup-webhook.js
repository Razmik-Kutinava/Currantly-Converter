// setup-webhook.js - Настройка webhook для Vercel
import 'dotenv/config'

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = 'https://currantly-converter.vercel.app/api/webhook';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в .env!');
  process.exit(1);
}

async function setupWebhook() {
  try {
    console.log('🔧 Настройка webhook для автономной работы...');
    console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);

    // Удаляем старый webhook
    const deleteResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    const deleteResult = await deleteResponse.json();
    console.log('🗑️ Удаление старого webhook:', deleteResult);

    // Устанавливаем новый webhook
    const setResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        drop_pending_updates: true
      })
    });

    const setResult = await setResponse.json();
    console.log('📡 Установка webhook:', setResult);

    if (setResult.ok) {
      console.log('✅ Webhook настроен успешно!');
    } else {
      console.error('❌ Ошибка настройки webhook:', setResult);
    }

    // Проверяем webhook
    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const infoResult = await infoResponse.json();
    console.log('ℹ️ Информация о webhook:', infoResult);

    // Устанавливаем команды и Menu Button
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commands: [
          { command: 'start', description: '🚀 Запустить бота' },
          { command: 'converter', description: '💱 Открыть конвертер валют' }
        ]
      })
    });

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: '💱 Конвертер',
          web_app: { url: 'https://currantly-converter.vercel.app' }
        }
      })
    });

    console.log('✅ Команды и Menu Button настроены!');
    console.log('\n🎉 ГОТОВО! Бот теперь работает автономно 24/7');
    console.log('🚀 Можете закрыть локальный bot.js - он больше не нужен!');

  } catch (error) {
    console.error('❌ Ошибка настройки:', error);
  }
}

setupWebhook();