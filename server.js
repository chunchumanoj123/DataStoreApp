const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const VISITOR_FILE = "visitors.json";
const TEXT_FILE = "texts.json";

// Get IP function
function getClientIP(req) {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}

// Log visitors
app.get("/visit", (req, res) => {
    const ip = getClientIP(req);
    let visitors = [];

    if (fs.existsSync(VISITOR_FILE)) {
        visitors = JSON.parse(fs.readFileSync(VISITOR_FILE));
    }

    if (!visitors.includes(ip)) {
        visitors.push(ip);
        fs.writeFileSync(VISITOR_FILE, JSON.stringify(visitors, null, 2));
    }

    res.json({ message: "Visitor logged", totalVisitors: visitors.length, visitors });
});

// Get all visitors
app.get("/visitors", (req, res) => {
    let visitors = fs.existsSync(VISITOR_FILE) ? JSON.parse(fs.readFileSync(VISITOR_FILE)) : [];
    res.json({ totalVisitors: visitors.length, visitors });
});

// Save text
app.post("/save", (req, res) => {
    let texts = fs.existsSync(TEXT_FILE) ? JSON.parse(fs.readFileSync(TEXT_FILE)) : [];
    texts.push(req.body.text);
    fs.writeFileSync(TEXT_FILE, JSON.stringify(texts, null, 2));
    res.json({ message: "Text saved" });
});

// Get all texts
app.get("/texts", (req, res) => {
    let texts = fs.existsSync(TEXT_FILE) ? JSON.parse(fs.readFileSync(TEXT_FILE)) : [];
    res.json(texts);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
