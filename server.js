const express = require('express');
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();
//const notes = require("./db/db");
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
    var notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    let results = notes;
    res.json(results);
  });
  
// Post API Route
app.post("/api/notes", (req, res) => {;
    var notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // Check to make sure the ID is unique
    for (let index = 0; index < notes.length; index++) {
        if (notes[index]['id'] && notes[index]['id'] === req.body.id) {
            idInt = Number(req.body.id);
            idInt += 1
            req.body.id = idInt.toString();
            index = 0
        }
        
    }
  
    const animal = createNewPost(req.body, notes);
    res.json(animal);
  });

function findById(id, array) {
    const result = array.filter(notez => notez.id === id)[0];
    return result;
}

app.delete("/api/notes/:id", (req, res) => {
    var notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    const result = findById(req.params.id, notes);
    if (result) {
        for (let index = 0; index < notes.length; index++) {
            if (notes[index] === result) {
                notes.splice(index, 1);
                fs.writeFileSync(
                    path.join(__dirname, './db/db.json'),
                    JSON.stringify(notes, null, 2)
                  );
                break
            }       
        }
        res.json(result);
    } else {
        res.send(404);
    }
});
  

// Cover all HTML Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});