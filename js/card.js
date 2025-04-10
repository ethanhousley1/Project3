// this JS file is for the trading card, which is probably our main product.

let allData; // api data stored globally, not really used yet
// it must import the API

function randomInt (min, max) {return Math.floor(Math.random() * (max-min + 1)) + min; }; // creating a random int function for randomizer
playerStats = document.createElement('p');

// setting up variables so we can use them on the example card on the hero page
let playerName = document.getElementById('player-name');
let playerTeam = document.getElementById('player-team');
let playerposition = document.getElementById('player-position');
let playerImage = document.getElementById('player-image');

body = document.querySelector('body');
body.appendChild(playerStats);
fetch('https://sports.is120.ckearl.com')
    .then(response => response.json())
    .then(data => {
        allData = data.data;
        // example searchParam for now
        let searchParam = 'Kyler Murray';
        getSpecificPlayer(allData, searchParam);

        
        
    })
    .catch(error => {
        console.error('Error:', error)
    });
    
    //beginning of randomizer   
    function getRandomPlayer () {
        
        

        // randomizes the league
        randomLeagueInt = randomInt(0,3);
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

        //redefines random league
        randomLeague = allData[randomLeague]


        // this is what the path looks like for a team name
        // console.log(randomLeague.teams[0].name);
        // this is the path for a player on
        // will cause an error if the random league is nba because there are no players in that league
        // console.log(allData[randomLeague].teams[1].roster[0].fullName);


        // grabs a random team
        leagueLength = randomLeague.teams.length
        randomTeam = (randomInt(1, leagueLength) - 1)

        //redefines randomTeam
        randomTeam = randomLeague.teams[randomTeam];

        //grabs random player, ignores nba
        // we will have to change the logic if he doesn't add nba players to rosters
        if (randomTeam.roster[0] !== null ) {
            randomPlayer = (randomInt(1, randomTeam.roster.length) -1 )
            randomPlayer = randomTeam.roster[randomPlayer];
            console.log(randomPlayer);
            
            // playerStats.innerHTML = randomPlayer.fullName + ' age: ' + randomPlayer.age + ' height(inches): ' + randomPlayer.height + ' weight(lbs): ' + randomPlayer.weight;  

            // this fills in the information on the random card on the hero page
            playerName.innerHTML = randomPlayer.fullName;
            playerTeam.innerHTML = randomTeam.name;
            playerposition.innerHTML = randomPlayer.position;  
            playerImage.src = randomPlayer.headshot;   
        }
    }


// this function will be core, it will find a specific player given the data and a parameter, like the first few letters in a search bar
// it will have to update every time there is an input in the search bar
// it will have to loop thru every league and pull out every player that matches the searchParam
//im thinking about using regex for this



function getSpecificPlayer(allData, searchParam) {
    selectedLeagues = ['mlb','nfl','nhl'] // i use this to ditch the nba
    console.log(allData);
    // console.log(allData[league].teams[team].roster[player].fullName
    for (let league in allData) {
        if (selectedLeagues.includes(league)) {
            for (let team in allData[league].teams) {
                for (let player in allData[league].teams[team].roster) {
                    let specificPlayer = allData[league].teams[team].roster[player];
                    if (specificPlayer.fullName.includes(searchParam)) {
                        displayPlayer(specificPlayer);
                    }
                    

                }
            }
        }
    }
};




