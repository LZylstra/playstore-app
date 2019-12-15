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
        if (!['rating', 'app', 'Rating', 'App'].includes(sort)){
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
        //uppercase the first letter for sort needed for data
        const upperFirst = sort.charAt(0).toUpperCase() + sort.substring(1);
        results.sort((a, b) => {
            // console.log(`A: ${a[upperFirst]}`)
            // console.log(`B: ${b[upperFirst]}`)

            let sortResult = a[upperFirst] > b[upperFirst] ? 1 : a[upperFirst] < b[upperFirst] ? -1 : 0;
            // console.log(`Result: ${sortResult}`)
            return sortResult;
        });
    }
  res  
    .json(results);
});

module.exports = app;