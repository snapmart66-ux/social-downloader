const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

let userState = {};

// زر البداية
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userState[chatId] = {};

  bot.sendMessage(chatId, "🔥 اختر الموقع:", {
    reply_markup: {
      keyboard: [
        ["🎵 تيك توك", "📸 انستا"],
        ["▶️ يوتيوب", "🐦 تويتر"],
        ["📌 بينترست", "📘 فيسبوك"],
        ["👻 سناب"]
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
  if (text.includes("تيك")  text.includes("انستا")  text.includes("يوتيوب")  text.includes("تويتر")  text.includes("بينترست")  text.includes("فيسبوك")  text.includes("سناب")) {

    userState[chatId] = { step: "type" };

    return bot.sendMessage(chatId, "اختر النوع:", {
      reply_markup: {
        keyboard: [["🎥 فيديو", "🎧 صوت"]],
        resize_keyboard: true
      }
    });
  }

  // اختيار النوع
  if (text === "🎥 فيديو" || text === "🎧 صوت") {

    if (!userState[chatId]) {
      return bot.sendMessage(chatId, "❗ اكتب /start أولاً");
    }

    userState[chatId].type = text;

    return bot.sendMessage(chatId, "📎 دز الرابط");
  }

  // الرابط
  if (text.startsWith("http")) {

    const type = userState[chatId]?.type;

    if (!type) {
      return bot.sendMessage(chatId, "❗ اختار الموقع والنوع أولاً /start");
    }

    bot.sendMessage(chatId, "⏳ جاري التحميل...");

    const file = file_${Date.now()};

    let command;

    if (type === "🎧 صوت") {
      command = yt-dlp -x --audio-format mp3 -o "${file}.mp3" ${text};
    } else {
      command = yt-dlp -o "${file}.mp4" ${text};
    }

    exec(command, async (err) => {
      if (err) {
        console.log(err);
        return bot.sendMessage(chatId, "❌ فشل التحميل");
      }

      try {
        if (type === "🎧 صوت") {
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
