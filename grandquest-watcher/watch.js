const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const fs = require("fs");

const TARGET_URL = "https://grandquest.jp/works";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1467773515737468929/BiKfrLWX8Es_G-mWQsKL-Gr3NooUgZogBom1hlpKnEIW_tqcw5HrJCygh7-Iz75R9QMr";

// 前回取得した最新記事URLを保存
const DATA_FILE = "./last.json";

async function checkUpdate() {
  const res = await axios.get(TARGET_URL);
  const $ = cheerio.load(res.data);

  // worksページの最初の記事を取得（構造に依存）
  const firstItem = $(".works-list a").first();
  const title = firstItem.find(".works-title").text().trim();
  const link = firstItem.attr("href");

  if (!title || !link) return;

  let lastData = {};
  if (fs.existsSync(DATA_FILE)) {
    lastData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  // 新しい記事か判定
  if (lastData.link !== link) {
    await axios.post(WEBHOOK_URL, {
      content: `🆕 **新しいWorksが追加されました！**\n\n**${title}**\n${link}`
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify({ title, link }));
    console.log("新規投稿を通知しました");
  } else {
    console.log("更新なし");
  }
}

// 10分ごとにチェック
cron.schedule("*/10 * * * *", checkUpdate);

// 初回即実行
checkUpdate();
// --- Render Web Service 対応：ポート待ち受け（ダミー） ---
const http = require("http");
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok");
  })
  .listen(PORT, () => console.log("Listening on", PORT));
// --- ここまで ---

const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const fs = require("fs");

const TARGET_URL = "https://grandquest.jp/works";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1467773515737468929/BiKfrLWX8Es_G-mWQsKL-Gr3NooUgZogBom1hlpKnEIW_tqcw5HrJCygh7-Iz75R9QMr";

// 前回取得した最新記事URLを保存
const DATA_FILE = "./last.json";

async function checkUpdate() {
  const res = await axios.get(TARGET_URL);
  const $ = cheerio.load(res.data);

  // worksページの最初の記事を取得（構造に依存）
  const firstItem = $(".works-list a").first();
  const title = firstItem.find(".works-title").text().trim();
  const link = firstItem.attr("href");

  if (!title || !link) return;

  let lastData = {};
  if (fs.existsSync(DATA_FILE)) {
    lastData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  // 新しい記事か判定
  if (lastData.link !== link) {
    await axios.post(WEBHOOK_URL, {
      content: `🆕 **新しいWorksが追加されました！**\n\n**${title}**\n${link}`
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify({ title, link }));
    console.log("新規投稿を通知しました");
  } else {
    console.log("更新なし");
  }
}

// 10分ごとにチェック
cron.schedule("*/10 * * * *", checkUpdate);

// 初回即実行
checkUpdate();
