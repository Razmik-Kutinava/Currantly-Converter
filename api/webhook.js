// /api/webhook.js - Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'BOT_TOKEN not configured' });
  }

  try {
    const update = req.body;
    console.log('Received update:', JSON.stringify(update, null, 2));

    // Обработка команды /converter
    if (update.message?.text === '/converter') {
      const chatId = update.message.chat.id;

      const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '💱 Конвертер валют - быстро и точно!',
          reply_markup: {
            inline_keyboard: [[
              {
                text: '� Открыть конвертер',
                web_app: { url: 'https://currantly-converter.vercel.app' }
              }
            ]]
          }
        })
      });

      if (!telegramResponse.ok) {
        console.error('Telegram API error:', await telegramResponse.text());
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}