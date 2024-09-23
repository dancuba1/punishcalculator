// Node.js (Express) backend code
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const stringSimilarity = require('string-similarity');
const app = express();
const PORT = 3000;

// Open SQLite database
let db = new sqlite3.Database('..../moves.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Endpoint to fetch the closest image name from SQLite based on similarity
app.get('/getGif', (req, res) => {
    const { character, move } = req.query;

    const query = `SELECT move_name, image_name FROM moves WHERE character_name = ?`;
    db.all(query, [character], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length > 0) {
            // Extract move names
            const moveNames = rows.map(row => row.move_name);

            // Find the best match for the requested move name
            const bestMatch = stringSimilarity.findBestMatch(move, moveNames);
            
            if (bestMatch.bestMatch.rating > 0.6) { // You can adjust the similarity threshold
                // Get the image name of the closest match
                const bestMatchRow = rows.find(row => row.move_name === bestMatch.bestMatch.target);
                res.json({ image_name: bestMatchRow.image_name });
            } else {
                res.status(404).json({ error: "No similar move found" });
            }
        } else {
            res.status(404).json({ error: "Character not found" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
