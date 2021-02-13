import express from "express";
import linebot from "linebot";
import dotenv from "dotenv";
import getPopularMusic from "./getPopularMusic.js";
import getHotPostsFromPtt from "./getHotPostsFromPtt.js";
dotenv.config();

const musicCategory = [
  "華語",
  "台語",
  "日語",
  "西洋",
  "電子",
  "R&B",
  "嘻哈",
  "搖滾",
  "爵士",
  "雷鬼",
];

const bot = linebot({
  channelId: process.env.LINEBOT_CHANNEL_ID,
  channelSecret: process.env.LINEBOT_CHANNEL_SECRET,
  channelAccessToken: process.env.LINEBOT_CHANNEL_ACCESS_TOKEN,
});

bot.on("message", async (event) => {
  if (event.message.type === "text") {
    let res = "meow~";
    const msg = event.message.text;
    console.log(msg); //
    if (msg.includes("音樂")) {
      for (let category of musicCategory) {
        if (msg.includes(category)) {
          res = await getPopularMusic(category).catch((err) => {
            console.error(err);
            return "忙碌中";
          });
          break;
        }
      }
    } else if (msg.includes("時事")) {
      res = await getHotPostsFromPtt().catch((err) => {
        console.error(err);
        return "忙碌中";
      });
    }
    event.reply(res);
  }
});

const app = express();

const linebotParser = bot.parser();
app.post("/linewebhook", linebotParser);
app.listen(process.env.PORT || 3000, function () {
  console.log("MeowBot is running.");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});
