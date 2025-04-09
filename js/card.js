// this JS file is for the trading card, which is probably our main product.

let allData; // api data stored globally
// it must import the API

fetch('https://sports.is120.ckearl.com')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        allData = data.data;
        for (let leagueName in allData) {
            console.log(leagueName);
            leagueList = document.createElement('p');
            leagueList.innerHTML = leagueName
            body = document.querySelector('body');
            body.appendChild(leagueList)
        }
    })
    .catch(error => {
        console.error('Error:', error)
    });

;
