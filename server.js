const express = require('express');
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();
const notes = require("./db/db");
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Funtion to create a new item on the arraw
function createNewPost(body, array) {
    const animal = body;
    array.push(animal);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(array, null, 2)
    );
    return animal;
  }


// Get HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//Get API Routes
app.get("/api/notes", (req, res) => {
    let results = notes;
    res.json(results);
  });
  
// Post API Route
app.post("/api/notes", (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();
  
    const animal = createNewPost(req.body, notes);
    res.json(animal);
  });
  

// Cover all HTML Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});