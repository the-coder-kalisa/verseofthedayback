const axios = require("axios");
const CronJob = require("cron").CronJob;
require("dotenv").config();

const webhook = process.env.SLACK_WEBHOOK_URL;
const bibleUrl = "https://labs.bible.org/api/?passage=random&type=json";

let verse;

const fetchVerse = async () => {
  console.log("Fetching verse");
  const { data } = await axios.get(bibleUrl);
  return data[0];
};

const getVerse = async () => {
  if (!verse) {
    verse = await fetchVerse();
  }
  return verse;
};

const postVerse = async () => {
  console.log("Posting verse");
  const verse = await getVerse();
  const res = await axios.post(webhook, {
    text: `<!channel> *${verse.bookname} ${verse.chapter}:${verse.verse}*\n${verse.text}`,
  });
  return res;
};

new CronJob(
  "15 8 * * *",
  async function () {
    verse = await fetchVerse();
    await postVerse();
  },
  null,
  true,
  "Africa/Johannesburg"
);
