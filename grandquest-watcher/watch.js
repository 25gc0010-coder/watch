/*************************************************
 * Render Web Service 用：ダミーHTTPサーバー
 *************************************************/
const http = require("http");
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("ok");
}).listen(PORT, () => {
  console.log("Listening on", PORT);
});

/*************************************************
 * Worksページ監視 → Discord通知Bot
 *************************************************/
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const TARGET_URL = "https://grandquest.jp/works";
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// 最後に通知した記事を保存（重複防止）
const DATA_FILE = path.join(__dirname, "last.json");

// 初期データ読み込み
function loadLast() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return null;
  }
}

// 保存
function saveLast(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// メイン処理
async function checkWorks() {
  try {
    const res = await axios.get(TARGET_URL);
    const $ = cheerio.load(res.data);

    // ※ HTML構造が変わったらここを調整
    const firstItem = $(".works-list a").first();

    const title = firstItem.find(".works-title").text().trim();
    const link = firstItem.attr("href");

    if (!title || !link) {
      console.log("記事が取得できませんでした");
      return;
    }

    const last = loadLast();

    if (!last || last.link !== link) {
      await axios.post(WEBHOOK_URL, {
        content: `🆕 **新しいWorksが追加されました！**\n\n**${title}**\n${link}`
      });

      saveLast({ title, link });
      console.log("新規投稿を通知しました");
    } else {
      console.log("更新なし");
    }

  } catch (err) {
    console.error("チェック中にエラー:", err.message);
  }
}

// 起動時に1回実行
checkWorks();

// 10分ごとにチェック
cron.schedule("*/10 * * * *", () => {
  console.log("定期チェック実行");
  checkWorks();
});
