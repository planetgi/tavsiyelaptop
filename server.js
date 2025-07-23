const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Örnek endpoint: /api/laptop-fiyat?model=asus tuf
app.get("/api/laptop-fiyat", async (req, res) => {
  const model = req.query.model || "asus tuf";
  const encodedModel = encodeURIComponent(model);

  // Şimdilik Hepsiburada örneği – ileride dinamikleştirebiliriz
  const url = `https://www.hepsiburada.com/ara?q=${encodedModel}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0" // bot engeli aşmak için gerekli
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const results = [];

    $(".product-card").each((i, el) => {
      const title = $(el).find("h3[data-test-id='product-card-name']").text().trim();
      const price = $(el).find("div[data-test-id='price-current-price']").text().trim();
      if (title && price) {
        results.push({ title, price });
      }
    });

    res.json({ query: model, count: results.length, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Fiyatlar alınamadı." });
  }
});

app.get("/", (req, res) => {
  res.send("Laptop fiyat API çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});

app.get("/api/laptop-fiyat", async (req, res) => {
  try {
    const model = req.query.model;
    if (!model) {
      return res.status(400).json({ error: "Model parametresi gerekli" });
    }

    // Buraya scraping veya veri çekme kodu gelecek
    // Örnek statik cevap:
    res.json([
      { model: "Asus TUF Gaming F15", fiyat: 21000, marka: "Asus" },
      { model: "Lenovo IdeaPad 3", fiyat: 18000, marka: "Lenovo" }
    ]);
  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});
