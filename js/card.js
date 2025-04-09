// this JS file is for the trading card, which is probably our main product.

let allData; // api data stored globally, not really used yet
// it must import the API

function randomInt (min, max) {return Math.floor(Math.random() * (max-min + 1)) + min; }; // creating a random int function for randomizer

fetch('https://sports.is120.ckearl.com')
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        allData = data.data;
        for (let leagueName in allData) {
            console.log(leagueName);
            leagueList = document.createElement('p');
            leagueList.innerHTML = leagueName
            body = document.querySelector('body');
            body.appendChild(leagueList)
        }


        //beginning of randomizer
    
        // randomizes the league
        randomLeagueInt = randomInt(0,3);
        console.log(randomLeagueInt)
        // clunky but this converts a random int into the league
        if (randomLeagueInt === 3) {
            randomLeague = 'nhl';
        } else if (randomLeagueInt === 2) {
            randomLeague = 'mlb';
        } else if (randomLeagueInt === 1) {
            randomLeague = 'nba';
        } else {
            randomLeague = 'nfl';
        }
        console.log(randomLeague);

        console.log(allData[randomLeague]);

    })
    .catch(error => {
        console.error('Error:', error)
    });






