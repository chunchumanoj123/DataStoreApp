const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = "data.json";

app.use(cors());
app.use(express.json());

// Save new text
app.post("/save", (req, res) => {
    let { text } = req.body;
    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Text cannot be empty" });
    }

    let texts = [];
    if (fs.existsSync(FILE_PATH)) {
        texts = JSON.parse(fs.readFileSync(FILE_PATH));
    }

    texts.push(text.trim());
    fs.writeFileSync(FILE_PATH, JSON.stringify(texts, null, 2));

    res.json({ success: true });
});

// Get all saved texts
app.get("/texts", (req, res) => {
    if (!fs.existsSync(FILE_PATH)) {
        return res.json([]);
    }

    let texts = JSON.parse(fs.readFileSync(FILE_PATH));
    res.json(texts);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
