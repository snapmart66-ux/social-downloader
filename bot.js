const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let userState = {};

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userState[chatId] = {};

  bot.sendMessage(chatId, "🔥 اختر الموقع:", {
    reply_markup: {
      keyboard: [
        ["📺 يوتيوب", "🎵 تيك توك"],
        ["📸 انستا", "🐦 تويتر"],
        ["📘 فيسبوك", "📌 بينترست"],
        ["👻 سناب"]
      ],
      resize_keyboard: true
    }
  });
});

// استقبال الرسائل
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // اختيار الموقع
  if (
    text.includes("يوتيوب") ||
    text.includes("تيك") ||
    text.includes("انستا") ||
    text.includes("تويتر") ||
    text.includes("فيس") ||
    text.includes("بينترست") ||
    text.includes("سناب")
  ) {
    userState[chatId] = { step: "type", platform: text };

    return bot.sendMessage(chatId, "🎯 اختر النوع:", {
      reply_markup: {
        keyboard: [["🎬 فيديو", "🎧 صوت"]],
        resize_keyboard: true
      }
    });
  }

  // اختيار النوع
  if (text === "🎬 فيديو" || text === "🎧 صوت") {
    if (!userState[chatId]) {
      return bot.sendMessage(chatId, "⚠️ اكتب /start");
    }

    userState[chatId].type = text;

    return bot.sendMessage(chatId, "🔗 ارسل الرابط");
  }

  // الرابط
  if (text.startsWith("http")) {
    const type = userState[chatId]?.type;

    if (!type) {
      return bot.sendMessage(chatId, "⚠️ اكتب /start");
    }

    bot.sendMessage(chatId, "⏳ جاري التحميل...");

    const file = file_${Date.now()};

    let command;

    if (type === "🎧 صوت") {
      command = yt-dlp -x --audio-format mp3 -o "${file}.mp3" "${text}";
    } else {
      command = yt-dlp -f best -o "${file}.mp4" "${text}";
    }

    exec(command, { maxBuffer: 1024 * 1024 * 50 }, async (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
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
