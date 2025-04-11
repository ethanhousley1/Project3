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

        // search bar
        const input = document.getElementById('search-bar');
            input.addEventListener('input', function() {
            console.log('Input changed:', input.value);
            getSpecificPlayer(allData, input.value);
        });


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

        // grabs random player, ignores nba
        // we will have to change the logic if he doesn't add nba players to rosters
        if (randomTeam.roster[0] !== null ) {
            randomPlayer = (randomInt(1, randomTeam.roster.length) -1 )
            randomPlayer = randomTeam.roster[randomPlayer];
            console.log(randomPlayer);
            
            // playerStats.innerHTML = randomPlayer.fullName + ' age: ' + randomPlayer.age + ' height(inches): ' + randomPlayer.height + ' weight(lbs): ' + randomPlayer.weight;  

            // this checks if there is already a card in the container and clears it if there is
            const container = document.querySelector("#example-card");
            container.innerHTML = "";

            // Create and insert new card on hero page
            createPlayerCard(
                randomPlayer.fullName,
                randomTeam.name,
                randomPlayer.position,
                randomPlayer.headshot,
                randomPlayer.height,
                randomPlayer.weight,
                randomPlayer.age,
                randomPlayer.experience,
                "#example-card"
            );
              
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
                        console.log(specificPlayer.fullName);
                        // displayPlayer(specificPlayer);
                        createPlayerCard(
                            specificPlayer.fullName,
                            specificPlayer.team,
                            specificPlayer.position,
                            specificPlayer.headshot,
                            specificPlayer.height,
                            specificPlayer.weight,
                            specificPlayer.age,
                            specificPlayer.experience,
                            "#card-grid"
                        );
                    }
                    

                }
            }
        }
    }
};


// Creating a function that will make a card both for the hero and for the cardgrid html page. This function will make it easier to implement and make it so we can use the same function for both pages
function createPlayerCard(name, team, position, imageSrc, height, weight, age, experience, containerId) {
    const parentContainer = document.querySelector(containerId);
  
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";
  
    const card = document.createElement("div");
    card.className = "card";
  
    // FRONT
    const front = document.createElement("div");
    front.className = "card-face front";
  
    const nameContainer = document.createElement("div");
    nameContainer.id = "player-name-container";
  
    const playerName = document.createElement("div");
    playerName.id = "player-name";
    playerName.textContent = name;
  
    const playerTeam = document.createElement("div");
    playerTeam.id = "player-team";
    playerTeam.textContent = team;
  
    nameContainer.appendChild(playerName);
    nameContainer.appendChild(playerTeam);
  
    const imageContainer = document.createElement("div");
    imageContainer.id = "player-image-container";
  
    const image = document.createElement("img");
    image.id = "player-image";
    image.src = imageSrc;
  
    imageContainer.appendChild(image);
  
    const positionDiv = document.createElement("div");
    positionDiv.id = "player-position";
    positionDiv.textContent = position;
  
    front.appendChild(nameContainer);
    front.appendChild(imageContainer);
    front.appendChild(positionDiv);
  
    // BACK
    const back = document.createElement("div");
    back.className = "card-face back";
  
    const statHeader = document.createElement("h3");
    statHeader.textContent = "Player Stats";
    back.appendChild(statHeader);
  
    const statsObj = {
      Height: height,
      Weight: weight,
      Age: age,
      Experience: experience,
    };

    for (let key in statsObj) {
      const p = document.createElement("p");
      p.textContent = `${key}: ${statsObj[key]}`;
      back.appendChild(p);
    }
  


    // Combine
    card.appendChild(front);
    card.appendChild(back);
    cardWrapper.appendChild(card);
    parentContainer.appendChild(cardWrapper);
}