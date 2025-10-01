import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'

// Конфигурация из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ Ошибка: BOT_TOKEN не найден в переменных окружения!');
  process.exit(1);
}

// Инициализация бота с улучшенными настройками
const bot = new TelegramBot(BOT_TOKEN, { 
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  },
  request: {
    agentOptions: {
      keepAlive: true,
      family: 4 // Принудительно использовать IPv4
    }
  }
});

// Настройка команд бота
bot.setMyCommands([
  { command: 'start', description: 'Запустить бота' },
  { command: 'converter', description: 'Открыть конвертер валют' }
]);

// Настройка Menu Button для Web App
bot.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: '🧪 Тест Mini App',
    web_app: { url: 'https://currantly-converter.vercel.app/test' }
  }
});

console.log('🔧 Команды и Menu Button настроены!');

// Обработка ошибок бота
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error);
});

// Обработка команд
bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userName = msg.from.first_name || 'Пользователь';
    
    console.log(`💬 Сообщение от ${userName} (${chatId}): ${text}`);
    
    if (text === '/start') {
      const welcomeMessage = `
🤖 Добро пожаловать в Конвертер Валют!

💱 Конвертируйте валюты с актуальными курсами в режиме реального времени.

🚀 Нажмите кнопку ниже, чтобы открыть конвертер валют:`;
      
      await bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: '🧪 Тест Mini App',
              web_app: { url: 'https://currantly-converter.vercel.app/test' }
            }
          ]]
        }
      });
    }
  } catch (error) {
    console.error('❌ Ошибка обработки сообщения:', error);
  }
});

// Обработчик команды /converter
bot.onText(/\/converter/, async (msg) => {
  const chatId = msg.chat.id;
  console.log(`💱 Команда /converter от ${msg.from.first_name} (${msg.from.id})`);
  
  try {
    await bot.sendMessage(chatId, '💱 Открываю конвертер валют...', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🧪 Тест Mini App',
            web_app: { url: 'https://currantly-converter.vercel.app/test' }
          }
        ]]
      }
    });
  } catch (error) {
    console.error('❌ Ошибка отправки конвертера:', error);
  }
});

console.log('🚀 =================================');
console.log('🤖 Бот запущен и готов к работе!');
console.log(`🔑 Токен: ${BOT_TOKEN.substring(0, 20)}...`);
console.log('💡 Убедитесь, что Vite сервер запущен на порту 3000');
console.log('🔗 Vite: npm run dev');
console.log('🚀 =================================');