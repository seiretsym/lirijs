# Liri JS

## Summary
A program written in javascript to run on node. It captures the users command line text for commands and search strings to use in the program. This program basically simulates Siri in a way to retrieve information on certain things with the use of Axios to retrieve data from Callback APIs and parse responses.

### **Highlights:**
- Node.js
- Git Bash
- OMDB API
- Bands In Town API
- Spotify API
- do-what-it-says randomly picks an api with a random string read from random.txt

## Dependencies
- Moment
- Axios
- node-spotify-api
- dotenv

## Technologies Used
- Node.js
- Javascript
- Git
- GitHub
- VSCode

## Goals
- Allow more commands

## Learning Experience
- Learned to utilize dotenv to mask my API Keys/Client IDs/Client Secrets
- Learned to read/write .txt files
- Learned to retrieve data from Callback APIs with Axios

## Demo Video
Demo: https://www.youtube.com/watch?v=n6ioy2FW3mw

## Code Snippets
This snippet is the function written to make an api request to `Bands In Town's Rest API` and parse certain information from the response retrieved with `Axios`

```
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
```

This function shortened my code by some lines by combining both `console.log` and `fs.appendFile`
```
// console.log and write in 1!
function log(string) {
    console.log(string);
    fs.appendFile("log.txt", string + "\n\n", function(err) {
        if (err) throw err;
    });
}
```

This function is what makes the command `do-what-it-says` do random things with random stuff
```
// do-what-it-says
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
```
## Links
LinkedIn: https://www.linkedin.com/in/kerwinhy/<br>
GitHub: https://github.com/seiretsym<br>
