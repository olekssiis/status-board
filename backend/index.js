const express = require("express");
const cors = require("cors");

const app = express();

//keeps track of in memory storage
let statuses = [];

app.use(cors());
app.use(express.json());

//get implementation
app.get("/statuses", (req, res) => {
    const sorted = statuses.sort((a, b) => b.createdAt - a.createdAt);
    res.json(sorted);
});

//post implementation
app.post('/statuses', (req, res) => {

    const { title, message, severity } = req.body;
  
    if (!title || !message || !severity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEntry = {
        id: Date.now(),
        title,
        message,
        severity,
        createdAt: Date.now()
    };

  
    statuses.push(newEntry);
    res.status(201).json(newEntry);
});

//Start the server

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started and running on http://localhost:${PORT}`);
});