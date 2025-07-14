const ShortUrl = require("../models/shortUrl");
const { nanoid } = require("nanoid");
const dayjs = require("dayjs");
const { Log } = require("../middleware/logger");

exports.createShortUrl = async (req, res, next) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const expiry = dayjs().add(validity, "minute").toDate();
    let finalCode = shortcode || nanoid(6);

    const existing = await ShortUrl.findOne({ shortcode: finalCode });
    if (existing) return res.status(409).json({ error: "Shortcode already exists" });

    const newUrl = await ShortUrl.create({
      originalUrl: url,
      shortcode: finalCode,
      expiry
    });

    await Log("backend", "info", "controller", `Short URL created: ${finalCode}`);

    res.status(201).json({
      shortLink: `${req.protocol}://${req.get("host")}/${finalCode}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    next(err);
  }
};

exports.redirectToOriginal = async (req, res, next) => {
  try {
    const { shortcode } = req.params;
    const doc = await ShortUrl.findOne({ shortcode });

    if (!doc) return res.status(404).json({ error: "Short URL not found" });
    if (dayjs().isAfter(doc.expiry)) return res.status(410).json({ error: "Link expired" });

    doc.clickCount++;
    doc.clicks.push({
      timestamp: new Date(),
      referrer: req.get("referrer") || "direct",
      location: "India"
    });
    await doc.save();

    await Log("backend", "info", "controller", `Redirected: ${shortcode}`);
    res.redirect(doc.originalUrl);
  } catch (err) {
    next(err);
  }
};

exports.getUrlStats = async (req, res, next) => {
  try {
    const { shortcode } = req.params;
    const doc = await ShortUrl.findOne({ shortcode });
    if (!doc) return res.status(404).json({ error: "Short URL not found" });

    res.json({
      originalUrl: doc.originalUrl,
      createdAt: doc.createdAt,
      expiry: doc.expiry,
      clickCount: doc.clickCount,
      clicks: doc.clicks
    });
  } catch (err) {
    next(err);
  }
};
