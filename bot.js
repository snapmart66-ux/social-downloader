const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

let userState = {};

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userState[chatId] = {};

  bot.sendMessage(chatId, "🔥 اختر الموقع:", {
    reply_markup: {
      keyboard: [
        ["🎵 تيك توك", "📸 انستا"],
        ["▶️ يوتيوب", "🐦 تويتر"],
        ["📌 بنترست", "📘 فيسبوك"],
        ["👻 سناب شات"]
      ],
      resize_keyboard: true
    }
  });
});

// استقبال الرسائل
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // اختيار الموقع
  if (
    text.includes("تيك توك") ||
    text.includes("انستا") ||
    text.includes("يوتيوب") ||
    text.includes("تويتر") ||
    text.includes("بنترست") ||
    text.includes("فيسبوك") ||
    text.includes("سناب")
  ) {
    userState[chatId] = { step: "type" };

    userState[chatId].platform = text;

    return bot.sendMessage(chatId, "📥 دز الرابط:");
  }

  // استقبال الرابط
  if (text.startsWith("http")) {
    const type = userState[chatId]?.platform;

    if (!type) {
      return bot.sendMessage(chatId, "❗ اكتب /start واختار الموقع أولاً");
    }

    bot.sendMessage(chatId, "⏳ جاري التحميل...");

    // 👇 هنا التصحيح المهم
    const file = file_${Date.now()};

    let command;

    // صوت
    if (text.includes("music") || text.includes("audio")) {
      command = yt-dlp -x --audio-format mp3 -o "${file}.mp3" ${text};
    } else {
      // فيديو
      command = yt-dlp -o "${file}.mp4" ${text};
    }

    exec(command, async (err) => {
      if (err) {
        console.log(err);
        return bot.sendMessage(chatId, "❌ فشل التحميل");
      }

      try {
        if (fs.existsSync(${file}.mp3)) {
          await bot.sendAudio(chatId, ${file}.mp3);
          fs.unlinkSync(${file}.mp3);
        } else {
          await bot.sendVideo(chatId, ${file}.mp4);
          fs.unlinkSync(${file}.mp4);
        }
      } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "❌ خطأ بالإرسال");
      }
    });
  }
});
