// Require different programs, port, and file storage
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


// start get requests for data and url 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        err ? console.log(err) : res.json(JSON.parse(data))
    })
})

// post request to create a new note
app.post('/api/notes', (req, res) => {
    var title = req.body.title
    var text = req.body.text
    var newNote = {
        title,
        text,
        id: uuidv4()
    }
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        var currentNotes = JSON.parse(data)
        currentNotes.push(newNote)
        fs.writeFile('db/db.json', JSON.stringify(currentNotes), (err) => {
            err ? console.log(err) : console.log(newNote.title + " has been saved");;
        })
        res.sendFile(path.join(__dirname, 'public/notes.html'));
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});