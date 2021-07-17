require('dotenv').config()
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser')



const app = express();
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.connect("mongodb://localhost:27017/rpgDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected to the port 27017'))


app.get('/api/series', function (req, res) {
    Serie.find()
        .then(function (series) {
            res.send(series);
        });
})

app.get('/api/tags/:tag', function (req, res) {
    const Tag = req.params.tag;
    Serie.find({ tags: Tag })
        .then(function (series) {
            res.send(series);
        });
})

app.get('/api/tags', function (req, res) {
    Serie.find({}, '-_id tags')
        .then(function (tags) {
            var tagCollection = [];
            for (let i = 0; i < tags.length; i++) {
                for (let j = 0; j < tags[i]['tags'].length; j++) {
                    const element = tags[i]['tags'][j]
                    if (tagCollection.indexOf(element) === -1) {
                        tagCollection.push(element)
                    }

                }
            }

            res.send(tagCollection)
        })
})

const userSchema = new mongoose.Schema({
    name: String,
    _id: {
        type: String,
        required: true
    },
    avatar: String,
    youtubeLink: {
        type: String,
        required: true
    },
})
const serieSchema = new mongoose.Schema({
    name: String,
    creator: String,
    _id: {
        type: String,
        required: true
    },
    numOfVids: Number,
    avatar: String,
    youtubeLink: {
        type: String,
        required: true
    },
    twitchLink: String,
    spotifyLink: String,
    resume: String,
    status: String,
    tags: {
        type: Array,
        items: {
            type: String
        }
    }
})

const User = mongoose.model('User', userSchema);
const Serie = mongoose.model('Serie', serieSchema);




app.listen(process.env.PORT || 8080,
    () => console.log("Server is running...")
);