const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('common')); // let's see what 'common' format looks like
const playstore = require('./playstore-data.js');

app.get('/apps', (req, res) => {
    const {genres = "", sort} = req.query;
    let lowercase = genres.toLowerCase();

    if (sort){
        if (!['rating', 'app'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }
    if (lowercase){
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(lowercase)){
            return res
                .status(400)
                .send('Genre must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, Card');
        }
    }
    let results = playstore.filter(app =>
        app.Genres.toLowerCase().includes(genres.toLowerCase()));
    
    if (sort){
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
  res  
    .json(results);
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});