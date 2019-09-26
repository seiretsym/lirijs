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
        console.log("spotify: " + string);
        break;
    case "movie-this":
        console.log("omdb: " + string);
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
    var key = keys.BIT;
    var queryUrl = "http://rest.bandsintown.com/artists/" + string + "/events?app_id=" + key;
    axios.get(queryUrl)
         .then(function(res) {
             var data = res.data;
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