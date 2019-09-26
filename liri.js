// requires

var dotenv = require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");

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
        console.log("do it: " + string);
        break;
    default:
        console.log("That command doesn't exist.\nList of commands:\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says");
        break;
}

// concert-this
function bandsInTown() {
    var bitkey = keys.BIT.key;
    console.log(bitkey)
    var queryUrl = "http://rest.bandsintown.com/artists/" + string + "/events?app_id=" + bitkey;
    // get that json
    axios.get(queryUrl)
         .then(function(res) {
             // shorten res data
             var data = res.data;
             // print results
             console.log("There are " + data.length + " venues found: ")
             data.forEach(function(data) {
                 console.log("\n**********")
                 console.log("Venue: " + data.venue.name);
                 console.log("Location: " + data.venue.city + ", " + data.venue.region)
                 console.log("Date: " + moment(data.datetime).format("MM/DD/YYYY"))
             })
         })
         .catch(function(err) {
             if (err) throw err;
         })
}

// movie-this
function OMDB() {
    var omdbkey = keys.OMDB.key;
    var queryUrl = "http://www.omdbapi.com/?t=" + string + "&apikey=" + omdbkey;
    // get that json
    axios.get(queryUrl)
         .then(function(res) {
             console.log("\n**************");
             console.log("Title: " + res.data.Title)
             console.log("Year Released: " + res.data.Year);
             console.log("Produced in " + res.data.Country)
             console.log("Languages: " + res.data.Language)
             console.log("** Ratings  **")
             console.log("IMDB: " + res.data.imdbRating);
             // find rotten tomatoes rating and print if found
             for (var i = 0; i < res.data.Ratings.length; i++) {
                 if (res.data.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes: " + res.data.Ratings[i].Value)
                 }
             }
             console.log("** Plot     **");
             console.log(res.data.Plot);
             console.log("** Starring **");
             console.log(res.data.Actors);
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
            console.log("******************************")
            var artists = "";
            for (var i = 0; i < trackData.artists.length; i++) {
                if (i === trackData.artists.length - 1) {
                    artists += trackData.artists[i].name;
                } else {
                    artists += trackData.artists[i].name + ", ";
                }
            }
            console.log("Artist(s): " + artists);
            console.log("Album: " + trackData.album.name)
            console.log("Song Name: " + trackData.name);
            console.log("Preview Link: " + trackData.preview_url)
        }


    }).catch(function(err) {
        if (err) throw err;
    })
}