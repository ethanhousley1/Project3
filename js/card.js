// this JS file is for the trading card, which is probably our main product.

let allData; // api data stored globally, not really used yet
// it must import the API

function show(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
}
  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
}
  

function randomInt (min, max) {return Math.floor(Math.random() * (max-min + 1)) + min; }; // creating a random int function for randomizer
playerStats = document.createElement('p');

// setting up variables so we can use them on the example card on the hero page
let playerName = document.getElementById('player-name');
let playerTeam = document.getElementById('player-team');
let playerposition = document.getElementById('player-position');
let playerImage = document.getElementById('player-image');

body = document.querySelector('body');
body.appendChild(playerStats);

let specificPlayerArray = [];
let loadedArray = [];
let listView = '';

if (document.getElementById('example-loader')) {show('example-loader');}
if (document.getElementById('card-grid-loader')) {show('card-grid-loader');}

fetch('https://sports.is120.ckearl.com')
    .then(response => response.json())
    .then(data => {
        allData = data;

        // Calling the randomplayer function to get a random card populated on the hero page if it is the index.html page
        if (document.getElementById('example-card')) {
            
            // DARK MODE FOR INDEX
            const toggleButton = document.getElementById('darkModeToggle');

            toggleButton.addEventListener('click', function() {
                document.querySelector('.hero-section').classList.toggle('dark-mode');
                document.querySelector('main').classList.toggle('dark-mode');
                
                console.log('button pressed');
            });

            getRandomPlayer();
            specificPlayerArray = []
        }

        // Calling this code only if we are on the cardgrid.html page
        if (window.location.pathname.includes("cardgrid.html")) {

            const toggleButton = document.getElementById('darkModeToggle');

            toggleButton.addEventListener('click', function() {
                document.querySelector('.background-color-wrapper').classList.toggle('dark-mode');
                listContainers = document.querySelectorAll('.list-container')
                console.log(listContainers);
                for (let container of listContainers) {
                    console.log(container);
                    container.classList.toggle('dark-mode');
                }
                document.querySelector('#search-button').classList.toggle('dark-mode');
                console.log('button pressed');
            });

            // * Search Bar *

            // * We have 2 search bars so you can compare players on either view *
            searchButton = document.getElementById('search-button')
            document.getElementById('cardgrid-header').appendChild(searchButton);

            // Calling card collection function to populate all cards on the cardgrid page
            populateAllCards(allData, "#card-grid");
            
            // Function that works when the search button is clicked
            searchButton.addEventListener('click', function() {

                specificPlayerArray = [];
                loadedArray = [];

                // Clearing previous players searched by the user to allow for a new card to be searched
                if (document.querySelector('#card-grid')) {
                    let container = document.querySelector("#card-grid");
                    container.innerHTML = '';

                    const seenNames = new Set(); // Set to keep track of seen player names and prevent duplicates

                    // Checking for the input from the first search bar
                    const input1 = document.getElementById('search-bar').value.trim();
                    // Checking for the input from the second search bar
                    const input2 = document.getElementById('search-bar-2').value.trim();

                    // If the input in the first search bar is not empty, call the getSpecificPlayer function
                    if (input1 !== "") {
                        getSpecificPlayer(allData, input1, seenNames);
                    }
                    
                    // If the input in the second search bar is not empty, call the getSpecificPlayer function
                    if (input2 !== "") {
                        getSpecificPlayer(allData, input2, seenNames);
                    }

                    // If both search bars are empty, and the search button is clicked, show all players
                    if (input1 === '' && input2 === '') {
                        // If both search bars are empty, show all players
                        populateAllCards(allData, "#card-grid");
                    } else {
                        createArray();
                        createPlayerCard(loadedArray);
                    }
                } else if (document.querySelector('#card-list')) {
                    let containerList = document.querySelector("#card-list");
                    containerList.innerHTML = '';

                    const seenNames = new Set(); // Set to keep track of seen player names and prevent duplicates

                    // Checking for the input from the first search bar
                    const input1 = document.getElementById('search-bar').value.trim();
                    // Checking for the input from the second search bar
                    const input2 = document.getElementById('search-bar-2').value.trim();

                    // If the input in the first search bar is not empty, call the getSpecificPlayer function
                    if (input1 !== "") {
                        getSpecificPlayer(allData, input1, seenNames);
                    }
                    
                    // If the input in the second search bar is not empty, call the getSpecificPlayer function
                    if (input2 !== "") {
                        getSpecificPlayer(allData, input2, seenNames);
                    }

                    // If both search bars are empty, and the search button is clicked, show all players
                    if (input1 === '' && input2 === '') {
                        // If both search bars are empty, show all players
                        console.log('empty');
                    } else {
                        createArray();
                        createPlayerList(loadedArray);
                    }


                }
                
            });
        }
    })
    .catch(console.error)
    .finally(() => {
        if (document.getElementById("example-loader")) hide("example-loader");
        if (document.getElementById("card-grid-loader")) hide("card-grid-loader");
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

        // grabs a random team
        leagueLength = randomLeague.teams.length
        randomTeam = (randomInt(1, leagueLength) - 1)

        //redefines randomTeam
        randomTeam = randomLeague.teams[randomTeam];

        // grabs random player, ignores nba
        // we will have to change the logic if he doesn't add nba players to rosters
        if (randomTeam.roster[0] !== null ) {
            let randomPlayer = (randomInt(1, randomTeam.roster.length) -1 )
            randomPlayer = randomTeam.roster[randomPlayer];
            
            // playerStats.innerHTML = randomPlayer.fullName + ' age: ' + randomPlayer.age + ' height(inches): ' + randomPlayer.height + ' weight(lbs): ' + randomPlayer.weight;  

            // this checks if there is already a card in the container and clears it if there is
            const container = document.querySelector("#example-card");
            container.innerHTML = "";

            let randomPlayerObject = {}; // the object HAS TO be in an array by itself
            specificPlayerArray = [];
            
            // this is what the player object looks like
                        // {
                        //     "fullName":
                        //     "teamName":
                        //     "position":
                        //     "headshot":
                        //     "height":
                        //     "weight":
                        //     "age":
                        //     "experience":
                        //     "logo":
                        //     "div":
                        // }
            randomPlayerObject = {
                "fullName": randomPlayer.fullName,
                "teamName": randomTeam.name,
                "position": randomPlayer.position,
                "headshot": randomPlayer.headshot,
                "height": randomPlayer.height,
                "weight": randomPlayer.weight,
                "age": randomPlayer.age,
                "experience": randomPlayer.experience,
                "logo": randomTeam.logo,
                "div": "#example-card",
                "color1": randomTeam.colors[0],
                "color2": randomTeam.colors[1],
            };
            // the old way we did it
            // randomPlayer.fullName,
            //     randomTeam.name,
            //     randomPlayer.position,
            //     randomPlayer.headshot,
            //     randomPlayer.height,
            //     randomPlayer.weight,
            //     randomPlayer.age,
            //     randomPlayer.experience,
            //     randomTeam.logo,
            //     "#example-card"
            // Create and insert new card on hero page

            specificPlayerArray.push(randomPlayerObject);
            createPlayerCard(specificPlayerArray);
        }
    }

// this function will be core, it will find a specific player given the data and a parameter, like the first few letters in a search bar
// it will have to update every time there is an input in the search bar
// it will have to loop thru every league and pull out every player that matches the searchParam

function createArray () {
    console.log('total items in array');
    console.log(specificPlayerArray);
    for (i = 0; i < 20 && i <= specificPlayerArray.length; i++) {
        loadedArray.push(specificPlayerArray.shift())

    }
    console.log(`current items in array:`);
    console.log(loadedArray);
    
}

function getSpecificPlayer(allData, searchParam, seenNames) {
    selectedLeagues = ['mlb','nfl','nhl', 'nba'] // this is the list of leagues we want to search
    for (let league in allData) {
        if (selectedLeagues.includes(league)) {
            for (let team in allData[league].teams) {
                for (let player in allData[league].teams[team].roster) {
                    let specificPlayer = allData[league].teams[team].roster[player];
                    if (specificPlayer.fullName && specificPlayer.fullName.toLowerCase().includes(searchParam.toLowerCase())) {
                        if (!seenNames.has(specificPlayer.fullName)) {
                            seenNames.add(specificPlayer.fullName); // Add the name to the set to avoid duplicates, if it isn't already in there
                            createPlayerObject = {
                                "fullName": specificPlayer.fullName,
                                "teamName": allData[league].teams[team].name,
                                "position": specificPlayer.position,
                                "headshot": specificPlayer.headshot,
                                "height": specificPlayer.height,
                                "weight": specificPlayer.weight,
                                "age": specificPlayer.age,
                                "experience" : specificPlayer.experience,
                                "logo" : allData[league].teams[team].logo,
                                "div" : "#card-grid",
                                "color1" : allData[league].teams[team].colors[0],
                                "color2": allData[league].teams[team].colors[1]
                            }
                            specificPlayerArray.push(createPlayerObject);
                        //     return seenNames;
                        // } else {
                        //     return seenNames;
                        }
                    }
                }
            }
        }
    }
    // createPlayerCard(specificPlayerArray);
};


// Creating a function that will make a card both for the hero and for the cardgrid html page. This function will make it easier to implement and make it so we can use the same function for both pages

//name, team, position, imageSrc, height, weight, age, experience, logoSrc, containerId

function createPlayerCard(array) {
    for (let player in array) {
        let specificPlayer = array[player];
        console.log(specificPlayer);
        let name = specificPlayer.fullName;
        let team = specificPlayer.teamName;
        let position = specificPlayer.position;
        let imageSrc = specificPlayer.headshot;
        let height = specificPlayer.height;
        let weight = specificPlayer.weight;
        let age = specificPlayer.age;
        let experience = specificPlayer.experience;
        let logoSrc = specificPlayer.logo;
        let containerId = specificPlayer.div;
        let color1 = specificPlayer.color1.color;
        let color2 = specificPlayer.color2.color;
        
        const parentContainer = document.querySelector(containerId);
        
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-wrapper";
    
        const card = document.createElement("div");
        card.className = "card";
    
        // FRONT
        const front = document.createElement("div");
        front.className = "card-face front";
        front.style.background = '';

        const nameContainer = document.createElement("div");
        nameContainer.id = "player-name-container";
        nameContainer.style.zIndex = 2;
    
        const playerName = document.createElement("div");
        playerName.id = "player-name";
        playerName.textContent = name;
    
        // const playerTeam = document.createElement("div");
        // playerTeam.id = "player-team";
        // playerTeam.textContent = team;
    
        nameContainer.appendChild(playerName);
        // nameContainer.appendChild(playerTeam);
    
        const imageContainer = document.createElement("div");
        imageContainer.id = "player-image-container";
        imageContainer.style.background = `linear-gradient(to top right, ${color1}, ${color2})`
        imageContainer.style.zIndex = 1;
        const image = document.createElement("img");
        image.id = "player-image";
        image.src = imageSrc;
        image.style.zIndex = 1000;
    
        imageContainer.appendChild(image);
    
        const positionDiv = document.createElement("div");
        positionDiv.id = "player-position";
        positionDiv.style.backgroundImage = '';
        positionDiv.textContent = position;
    
        front.appendChild(nameContainer);
        front.appendChild(imageContainer);
        front.appendChild(positionDiv);
    
        // BACK
        const back = document.createElement("div");
        back.className = "card-face back";
    
        back.style.backgroundImage = `url(${logoSrc})`;
        back.style.backgroundSize = "contain";
        back.style.backgroundRepeat = "no-repeat";
        back.style.backgroundPosition = "center";

        const statHeader = document.createElement("h3");
        statHeader.textContent = "Player Stats";
        statHeader.style.backgroundColor = '#ffffff';
        statHeader.style.borderRadius = '5px';
        statHeader.style.padding = '2px';
        back.appendChild(statHeader);
    
        // Some players didn't have jersey numbers, so we opted to just go for the raw stats available on the API here
        const statsObj = {
        Height: height,
        Weight: weight,
        Age: age,
        Experience: experience,
        };

        const heightPlayer = document.createElement('p');
        heightPlayer.textContent = `Height: ${Math.floor((statsObj.Height)/12)}' ${(statsObj.Height % 12)}"`;
        heightPlayer.id = 'back-inner';
        back.appendChild(heightPlayer);

        const weightPlayer = document.createElement('p');
        weightPlayer.textContent = `Weight: ${statsObj.Weight} lbs`
        weightPlayer.id = 'back-inner';
        back.appendChild(weightPlayer);

        const agePlayer = document.createElement('p');
        agePlayer.textContent = `Age: ${statsObj.Age} years`
        agePlayer.id = 'back-inner';
        back.appendChild(agePlayer);

        const experiencePlayer = document.createElement('p');
        experiencePlayer.textContent = `Experience: ${statsObj.Experience}`
        experiencePlayer.id = 'back-inner';
        back.appendChild(experiencePlayer);

        // Combine
        card.appendChild(front);
        card.appendChild(back);
        cardWrapper.appendChild(card);
        parentContainer.appendChild(cardWrapper);

        //create the load more button;
        loadBtn = document.createElement('button');
        
    }
}

// Fisher–Yates shuffle in‐place
// ChatGPT provided this function to help us shuffle the array of cards before they have been rendered by populateAllCards()
function shuffleArray(arr) {
    let m = arr.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      // swap arr[m] and arr[i]
      t = arr[m];
      arr[m] = arr[i];
      arr[i] = t;
    }
    return arr;
}

    // Making a function that will print the card collection
    // this will be used for the card collection page
    // it will use createPlayerCard
function populateAllCards(allData, containerId) {
    // Set the parent container as container variable
    const container = document.querySelector(containerId);
    container.innerHTML = ""; // Clear previous cards if any
    
    // This can include nba later if that gets updated
    const selectedLeagues = ["mlb", "nfl", "nhl", "nba"];
    
    // Looping through each selected league, and then through each team and player
    selectedLeagues.forEach((league) => {
        const leagueData = allData[league];
        // Checking if leagueData exists, then continuing if it does, or returning if it doesn't
        if (!leagueData) return;
    
        // Looping through each team in the league
        leagueData.teams.forEach((team) => {
            // Looping through each player in each team
            team.roster.forEach((player) => {
                // Only creating card if player data is complete
                if (player && player.fullName && player.headshot) {
                    // Calling the createPlayerCard function to create a card for each player in each team
                    //"fullName": specificPlayer.fullName,
                    // "teamName": allData[league].teams[team].name,
                    // "position": specificPlayer.position,
                    // "headshot": specificPlayer.headshot,
                    // "height": specificPlayer.height,
                    // "weight": specificPlayer.weight,
                    // "age": specificPlayer.age,
                    // "experience" : specificPlayer.experience,
                    // "logo" : allData[league].teams[team].logo,
                    // "div" : "#card-grid",
                    createPlayerObject = {
                        "fullName": player.fullName,
                        "teamName":team.name,
                        "position":player.position,
                        "headshot":player.headshot,
                        "height":player.height,
                        "weight": player.weight,
                        "age": player.age,
                        "experience" :player.experience,
                        "logo" :team.logo,
                        "div" :containerId,
                        "color1" : team.colors[0],
                        "color2": team.colors[1],
                    };
                    specificPlayerArray.push(createPlayerObject);
                }
            });
        });
    });
    shuffleArray(specificPlayerArray); // Shuffle the array before displaying
    createArray();
    createPlayerCard(loadedArray);
}


// * Part of the Pagination on our website, we use 2 arrays
// * One array stores all the data, the other stores the data that will load
// the createArray simply moves some of the data to the array that will load it
// that way, its easy to keep track when you switch views *
function loadMoreBtn() {
    createArray();

    if (document.getElementById('card-grid')) {
        document.getElementById('card-grid').innerHTML = '';
        createPlayerCard(loadedArray)
    } else if (document.getElementById('card-list')) {
        document.getElementById('card-list').innerHTML = '';
        createPlayerList(loadedArray)
    }
}

// * Switched between mutliple views of the players *
function switchGridView() {
    if (document.getElementById('card-grid')) {
        div = document.getElementById('card-grid');
        div.innerHTML = '';
        div.id = 'card-list';
        createPlayerList(loadedArray)
        listView = 'list';
    } else if (document.getElementById('card-list')) {
        div = document.getElementById('card-list');
        div.innerHTML = '';
        div.id = 'card-grid';
        createPlayerCard(loadedArray)
        listView = '';
    }
}

function createPlayerList (array) {
    let parentContainer = document.getElementById('card-list');
    let firstItem = document.createElement('div');
    firstItem.classList.add('first-list-container');
    firstItem.innerHTML = '<h4>Name | </h4><p>Team | </p><p>Position | </p><p>Height (in) | </p><p>Weight (lbs) | </p><p>Age (years) | </p><p>Experience</p>';
    parentContainer.appendChild(firstItem);
    
    for (let player in array) {
        
        let specificPlayer = array[player];
        let name = specificPlayer.fullName;
        let team = specificPlayer.teamName;
        let position = specificPlayer.position;
        // let imageSrc = specificPlayer.headshot;
        let height = specificPlayer.height;
        let weight = specificPlayer.weight;
        let age = specificPlayer.age;
        let experience = specificPlayer.experience;
        // let logoSrc = specificPlayer.logo;
        // let color1 = specificPlayer.color1.color;
        // let color2 = specificPlayer.color2.color;

        // make sure that containerId is the new grid id, will contain new styles

        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');

        const playerName = document.createElement('h4');
        playerName.innerHTML = name;
        listContainer.appendChild(playerName);

        const teamName = document.createElement('p');
        teamName.innerHTML = team;
        listContainer.appendChild(teamName);

        const positionName = document.createElement('p');
        positionName.innerHTML = position;
        listContainer.appendChild(positionName);

        // skipping image for the list
        const playerHeight = document.createElement('p');
        playerHeight.innerHTML = height;
        listContainer.appendChild(playerHeight);

        const playerWeight = document.createElement('p');
        playerWeight.innerHTML = weight;
        listContainer.appendChild(playerWeight);

        const playerAge = document.createElement('p');
        playerAge.innerHTML = age;
        listContainer.appendChild(playerAge);
        
        const playerExperience = document.createElement('p');
        playerExperience.innerHTML = experience;
        listContainer.appendChild(playerExperience);

        parentContainer.appendChild(listContainer);
        // might do colors later
    }
}