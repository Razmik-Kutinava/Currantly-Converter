import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден!');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN);

async function setupBot() {
  try {
    console.log('🔧 Настройка бота для Telegram Mini App...');

    // 1. Устанавливаем команды
    await bot.setMyCommands([
      { command: 'start', description: '🚀 Запустить бота' },
      { command: 'converter', description: '💱 Открыть конвертер валют' }
    ]);
    console.log('✅ Команды установлены');

    // 2. Устанавливаем Menu Button
    await bot.setChatMenuButton({
      menu_button: {
        type: 'web_app',
        text: '💱 Конвертер',
        web_app: { url: 'https://currantly-converter.vercel.app' }
      }
    });
    console.log('✅ Menu Button установлена');

    // 3. Получаем информацию о боте
    const botInfo = await bot.getMe();
    console.log('🤖 Информация о боте:');
    console.log(`   Имя: ${botInfo.first_name}`);
    console.log(`   Username: @${botInfo.username}`);
    console.log(`   ID: ${botInfo.id}`);

    // 4. Проверяем текущие команды
    const commands = await bot.getMyCommands();
    console.log('📋 Текущие команды:');
    commands.forEach(cmd => {
      console.log(`   /${cmd.command} - ${cmd.description}`);
    });

    console.log('\n🎉 Бот настроен успешно!');
    console.log('\n📋 ВАЖНО! Теперь вам нужно:');
    console.log('1. Открыть @BotFather в Telegram');
    console.log('2. Выбрать вашего бота');
    console.log('3. Нажать "Bot Settings" → "Menu Button"');
    console.log('4. Отправить URL: https://currantly-converter.vercel.app');
    console.log('\nИли используйте команду в @BotFather:');
    console.log('/setmenubutton');
    console.log(`@${botInfo.username}`);
    console.log('https://currantly-converter.vercel.app');

  } catch (error) {
    console.error('❌ Ошибка настройки:', error);
  }
  
  process.exit(0);
}

setupBot();