const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

let userState = {};

const sitesKeyboard = {
  reply_markup: {
    keyboard: [
      ["🎵 تيك توك", "📸 انستا"],
      ["▶️ يوتيوب", "🐦 تويتر"],
      ["📌 بينترست", "📘 فيسبوك"],
      ["👻 سناب شات"]
    ],
    resize_keyboard: true
  }
};

const typeKeyboard = {
  reply_markup: {
    keyboard: [
      ["🎥 فيديو", "🎧 صوت"]
    ],
    resize_keyboard: true
  }
};

// بدء
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🔥 اختر الموقع:", sitesKeyboard);
});

// استقبال الرسائل
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // اختيار الموقع
  if (text.includes("تيك")  text.includes("انستا")  text.includes("يوتيوب")  text.includes("تويتر")  text.includes("بينترست")  text.includes("فيسبوك")  text.includes("سناب")) {
    userState[chatId] = { step: "type" };
    return bot.sendMessage(chatId, "اختر النوع:", typeKeyboard);
  }

  // اختيار النوع
  if (text === "🎥 فيديو" || text === "🎧 صوت") {
    userState[chatId].type = text;
    userState[chatId].step = "link";
    return bot.sendMessage(chatId, "📎 دز الرابط");
  }

  // استقبال الرابط
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
