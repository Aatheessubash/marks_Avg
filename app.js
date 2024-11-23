const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('docs'));

// API to save marks and calculate average
app.post('/api/calculate', (req, res) => {
    const { roll_number, java, linux, maths } = req.body;

    // Check if all required fields are provided
    if (!roll_number || !java || !linux || !maths) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const average = (java + linux + maths) / 3;

    const sql = `INSERT INTO student_mark (roll_number, java, linux, maths, average) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [roll_number, java, linux, maths, average], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error saving data to the database');
        }
        res.status(200).json({ message: 'Data saved successfully', average });
    });
});


// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
