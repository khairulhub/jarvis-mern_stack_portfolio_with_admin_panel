const Visitor = require("../models/Visitor");

// ─── Helper: parse device/browser/OS from User-Agent ────────────
const parseUserAgent = (ua = "") => {
  let device = "desktop";
  if (/mobile/i.test(ua)) device = "mobile";
  else if (/tablet|ipad/i.test(ua)) device = "tablet";

  let browser = "Unknown";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  let os = "Unknown";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad/i.test(ua)) os = "iOS";
  else if (/mac/i.test(ua)) os = "macOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
};

// ─── Helper: get real IP ─────────────────────────────────────────
const getRealIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress || req.ip || "unknown";
};

// ─── Helper: fetch geo info from ip-api.com (free) ───────────────
const fetchGeoInfo = async (ip) => {
  try {
    // localhost / private IP hle skip koro
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168") ||
      ip.startsWith("10.") ||
      ip === "unknown"
    ) {
      return {
        country: "Local",
        countryCode: "LO",
        region: "Local",
        city: "Local",
        isp: "Local Network",
        org: "",
        timezone: "",
        lat: 0,
        lon: 0,
      };
    }

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,org,timezone,lat,lon`
    );
    const data = await response.json();

    if (data.status !== "success") return {};

    return {
      country: data.country || "",
      countryCode: data.countryCode || "",
      region: data.regionName || "",
      city: data.city || "",
      isp: data.isp || "",
      org: data.org || "",
      timezone: data.timezone || "",
      lat: data.lat || 0,
      lon: data.lon || 0,
    };
  } catch {
    return {};
  }
};

// ════════════════════════════════════════════════════════════════
// POST /api/visitors/track
// Public — frontend theke call hobe jokkhon portfolio load nbe
// ════════════════════════════════════════════════════════════════
const trackVisitor = async (req, res) => {
  try {
    const ip = getRealIp(req);
    const ua = req.headers["user-agent"] || "";

    // Already ache? → count hobey na, quietly return koro
    const existing = await Visitor.findOne({ ip });
    if (existing) {
      return res.status(200).json({ success: true, isNew: false });
    }

    // Geo + device info
    const geo = await fetchGeoInfo(ip);
    const { device, browser, os } = parseUserAgent(ua);

    await Visitor.create({
      ip,
      userAgent: ua,
      device,
      browser,
      os,
      ...geo,
    });

    return res.status(201).json({ success: true, isNew: true });
  } catch (err) {
    // Duplicate key error (race condition) → quietly ignore
    if (err.code === 11000) {
      return res.status(200).json({ success: true, isNew: false });
    }
    console.error("Visitor track error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ════════════════════════════════════════════════════════════════
// GET /api/visitors/count
// Public — frontend-এ শুধু total number দেখাবে
// ════════════════════════════════════════════════════════════════
const getVisitorCount = async (req, res) => {
  try {
    const total = await Visitor.countDocuments();
    return res.status(200).json({ success: true, total });
  } catch (err) {
    console.error("Visitor count error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ════════════════════════════════════════════════════════════════
// GET /api/visitors/details
// Protected (admin only) — সব visitor IP + details দেখাবে
// ════════════════════════════════════════════════════════════════
const getVisitorDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [visitors, total] = await Promise.all([
      Visitor.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      Visitor.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      visitors,
    });
  } catch (err) {
    console.error("Visitor details error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { trackVisitor, getVisitorCount, getVisitorDetails };
