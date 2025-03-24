const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "data.json";

// Load data from file
const loadData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Save data to file
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all saved texts
app.get("/", (req, res) => {
    res.json(loadData());
});

// Save a new text
app.post("/", (req, res) => {
    const texts = loadData();
    if (!req.body.text) {
        return res.status(400).json({ error: "Text is required!" });
    }
    texts.push(req.body.text);
    saveData(texts);
    res.json({ success: true, message: "Text saved!" });
});

// Delete a text by index
app.delete("/:index", (req, res) => {
    let texts = loadData();
    const index = parseInt(req.params.index);

    if (index < 0 || index >= texts.length) {
        return res.status(400).json({ error: "Invalid index!" });
    }

    texts.splice(index, 1);
    saveData(texts);
    res.json({ success: true, message: "Text deleted!" });
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
