const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { stringify } = require('querystring');
const PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');
const notesFeedback = require('./db/db.json')
// const index = require('./public/assets/js/index')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended : true}))

//send the request to fetch the index.html page on load of port
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// send request to fetch notes.html when clicking get startd
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf-8', function(err,data) {
        // res.send(uuidv4())
        console.log(data)
    })
    res.json(notesFeedback)
});

app.post('/api/notes', (req,res) => {
    req.body.id = uuidv4()
    notesFeedback.push(req.body)
    fs.writeFileSync('./db/db.json', JSON.stringify(notesFeedback))
    res.json(notesFeedback)
})

app.delete('/api/notes/:id', (req,res) => {
    const id = req.params.id;
    for (let i = 0; i < notesFeedback.length; i++) {
        if(notesFeedback[i].id == id) {
            notesFeedback.splice(i, 1)
            // console.log(notesFeedback[i])
            fs.writeFileSync('./db/db.json', JSON.stringify(notesFeedback))
            res.json(notesFeedback)
        }
    }
})

app.listen(PORT, () =>
    console.log(`listening for requests on port http://localhost:${PORT}`)
);