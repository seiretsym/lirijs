// requires

var dotenv = require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var string = stringArgv();

// grab string input from process.argV
function stringArgv() {
    var string = "";
    for (var i = 3; i < process.argv.length; i++) {
        if (i === process.argv.length - 1) {
            string += process.argv[i];
        } else {
            string += process.argv[i] + "+";
        }
    }
    return string;
}

// get command from processargV
var cmd = process.argv[2];

// create a command case
switch(cmd) {
    case "concert-this":
        bandsInTown();
        break;
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        OMDB();
        break;
    case "do-what-it-says":
        random();
        break;
    default:
        console.log("That command doesn't exist.\nList of commands:\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says");
        break;
}

// concert-this
function bandsInTown() {
    var bitkey = keys.BIT.key;
    var queryUrl = "http://rest.bandsintown.com/artists/" + string + "/events?app_id=" + bitkey;
    // get that json
    axios.get(queryUrl)
         .then(function(res) {
             // shorten res data
             var data = res.data;
             // print results
             var stringData = [];
             stringData.push("There are " + data.length + " venues found for " + string + ": ");
             data.forEach(function(data) {
                stringData.push("******************************");
                stringData.push("Venue: " + data.venue.name);
                stringData.push("Location: " + data.venue.city + ", " + data.venue.region);
                stringData.push("Date: " + moment(data.datetime).format("MM/DD/YYYY"));
             })
             var newString = stringData.join("\n\n");
             log(newString);
         })
         .catch(function(err) {
             console.log(err)
         })
}

// movie-this
function OMDB() {
    var omdbkey = keys.OMDB.key;
    var queryUrl = "http://www.omdbapi.com/?t=" + string + "&apikey=" + omdbkey;
    // get that json
    axios.get(queryUrl)
         .then(function(res) {
             // find rotten tomatoes rating and print if found
             var rtExists = false;
             var index = 0;
             for (var i = 0; i < res.data.Ratings.length; i++) {
                 if (res.data.Ratings[i].Source === "Rotten Tomatoes") {
                    index = i;
                    rtExists = true;
                 }
             } 
             if (rtExists) {
                var stringData = [
                    "******************************",
                    "Title: " + res.data.Title,
                    "Year Released: " + res.data.Year,
                    "Produced in " + res.data.Country,
                    "Languages: " + res.data.Language,
                    "***** Ratings",
                    "IMDB: " + res.data.imdbRating,
                    "Rotten Tomatoes: " + res.data.Ratings[index].Value,
                    "***** Plot",
                    res.data.Plot,
                    "***** Starring",
                    res.data.Actors
                 ].join("\n\n");
                 log(stringData)
             }
             else {
                var stringData = [
                    "******************************",
                    "Title: " + res.data.Title,
                    "Year Released: " + res.data.Year,
                    "Produced in " + res.data.Country,
                    "Languages: " + res.data.Language,
                    "***** Ratings",
                    "IMDB: " + res.data.imdbRating,
                    "***** Plot",
                    res.data.Plot,
                    "***** Starring",
                    res.data.Actors
                ].join("\n\n");
                log(stringData)
             }
         })
         .catch(function(err) {
             if (err) throw err;
         })
}


// spotify-this-song
function spotify() {
    var spotify = new Spotify(keys.spotify);
    if (string === "") {
        string = "The Sign by Ace of Base"
    };
    spotify.search({
        type: "track",
        query: string
    }).then(function(res) {
        if (res.tracks.total === 0) {
            console.log("Can't find a song called " + string)
        } else {
            var trackData = res.tracks.items[0];
            var artists = "";
            for (var i = 0; i < trackData.artists.length; i++) {
                if (i === trackData.artists.length - 1) {
                    artists += trackData.artists[i].name;
                } else {
                    artists += trackData.artists[i].name + ", ";
                }
            }
            var stringData = [
                "******************************",
                "Artist(s): " + artists,
                "Album: " + trackData.album.name,
                "Song Name: " + trackData.name,
                "Preview Link: " + trackData.preview_url,
            ].join("\n\n");
            log(stringData);
        }

    }).catch(function(err) {
        if (err) throw err;
    })
}

// do-what-its-says
function random() {
    // read from random.txt
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) throw error;
        var dataArray = data.split("\r\n");
        
        // get some random numbers
        var randomIndex = Math.floor(Math.random() * dataArray.length);
        var randomFunction = Math.floor(Math.random() * 3) + 1;

        // set string
        string = dataArray[randomIndex];

        // now pick a random function to run
        switch (randomFunction) {
            case 1:
                spotify();
                break;
            case 2:
                bandsInTown();
                break;
            case 3:
                OMDB();
        }
    })
}
// console.log and write in 1!
function log(string) {
    console.log(string);
    fs.appendFile("log.txt", string + "\n\n", function(err) {
        if (err) throw err;
    });
}