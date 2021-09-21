/*
	Things to add:
*/


/*===========================
	SETUP
===========================*/
//#region Setup
$(document).ready(function() {
    makeHidden();
	displayData();
	setGradient();
});

function setGradient(){
	$('.game').each(function () {
		let current = $(this).find('.gameConsole');
		if(current.text().includes(',')){
			$(this).css("background-image", gradient(current.text()));
			if(current.text().includes('ps2') || current.text().includes('ps3') || current.text().includes('ps4')){
				$(this).css("color", "white");
			}
		} else {
			$(this).css("background-color", `var(--${current.text()})`);
			let rgb = $(this).css("background-color");

			let colorArr = rgb.slice(
				rgb.indexOf("(") + 1, 
				rgb.indexOf(")")
			).split(", ");

			$(this).css("color", setTextColor(colorArr));
		}
	})
}

function setTextColor(rgb){
	const brightness = Math.round(((parseInt(rgb[0]) * 299) +
                      (parseInt(rgb[1]) * 587) +
                      (parseInt(rgb[2]) * 114)) / 1000);
	const textColour = (brightness > 125) ? 'black' : 'white';
	return textColour;

}

function gradient(str){
	// `linear-gradient(var(--${current.text()}))`
	let consoleArr = str.split(",");
	let linStr = `linear-gradient(to bottom right, `;
	for (let con in consoleArr){
		linStr += `var(--${consoleArr[con]}),`;
	}
	linStr = linStr.slice(0, -1);
	linStr += `)`;
	return linStr;


}

// Hide everything then display something when dropdown is changed
$('#dataSelection').on('change', function() {
	event.preventDefault();
	makeHidden();
	displayData();
});

$(document).on('change', '#categorySelection', function(){
    event.preventDefault();
	displayCategory();
	
});

$(document).on('change', '#rankSelection', function(){
    event.preventDefault();
	displayRanks();
	
});

$(document).on('change', '#pubDateSelection', function(){
    event.preventDefault();
	displayPubDates();
	
});

$(document).on('change', '#consoleSelection', function(){
    event.preventDefault();
	displayConsole();
	
});

//#endregion

//#region Hide/Show

// Hides all elements
function makeHidden() {
	$('.yearBox').hide();
	$('.categoryBox').hide();
	$('.allGames').hide();
	$('.rankBox').hide();
	$('.consoleBox').hide();
	$('.pubBox').hide();
}

// Shows the selected section and runs its function
function displayData() { 
	switch($('#dataSelection').val()){
		case 'all':
			allGames();
			$('.allGames').show();
			
			break;
		case 'category':
			categorySetup();	
			$('.categoryBox').show();
			
			break;
		case 'rankedBtn':
			rankSetup();
			$('.rankBox').show();
			
			break;
		case 'pubDate':
			pubDateSetup();
			$('.pubBox').show();
			
			break;
		case 'console':
			consoleSetup();	
			$('.consoleBox').show();
			
			break;
	}
}
//#endregion

/*===========================
	ALL GAMES PLAYED
===========================*/
//#region All Games
// Pulls all of the games and displays them
function allGames() {
	let allGames = ``;
	let gamesForAll = 0;

	// Appends the next game (in HTML) and adds to the count and pages of the variables
	for (let game in gameData) {
		allGames += `<div class="game"><div class="title">${gameData[game].title}</div><div class="year">${gameData[game]
			.yearReleased}</div><div class="rating">Rating: ${gameData[game].myRating}/10</div><div class="gameConsole">${gameData[game].gameConsole}</div></div>`;
		gamesForAll += 1;
		gameData[game].id = game;
	}

	$('.allGames').html(`     
			<h3>${gamesForAll} games</h3>
			<div class="gameList">${allGames}</div>
    `);
}
//#endregion

/*===========================
	GAMES BY PUBLICATION DATE
===========================*/
//#region PubDate
function pubDateSetup() {
	let gameArr = JSON.parse(JSON.stringify(gameData));
	let pubDates = [];
	for(let game in gameArr){
		if(gameArr[game].yearReleased != undefined){
			if(!pubDates.includes(gameArr[game].yearReleased)){
				pubDates.push(gameArr[game].yearReleased);
			}
		}
	}
	
	pubDates.sort((a, b) => b - a);
	printPubDates(pubDates);
}

function printPubDates(pubDates) {
	let pubDateStr = ``;
	for(let pubDate in pubDates) {
		pubDateStr += `<option value="${pubDates[pubDate]}">${pubDates[pubDate]}</option>`
	}

	$('.pubBox').html(`
			<label for="pubDateSelection" id="pubDateLabel">Select a release year</label>
			<select name="pubDateSelection" id="pubDateSelection" class="dataDrop">
				<option disabled selected>Year</option>
				<option value="all">All Years</option>        
				${pubDateStr}
			</select>
			<div class="pubDateGames"></div>
    `);
}

function displayPubDates() {
	let pubDatesChoice = $('#pubDateSelection').val();
	let pubDatesGameList = ``;
	let gameCount = 0;
	let gameWord = 'games';

    

	let yearArr = JSON.parse(JSON.stringify(gameData));
	yearArr.sort(function(a, b) {
		return b.yearReleased - a.yearReleased;
	});	

	for (let game in yearArr) {
		if (yearArr[game].yearReleased == undefined) {
		} else if(pubDatesChoice == "all"){
			

			pubDatesGameList += `<div class="game"><div class="title">${yearArr[game].title}</div><div class="year">${yearArr[game]
                .yearReleased}</div><div class="rating">Rating: ${yearArr[game].myRating}/10</div><div class="gameConsole">${yearArr[game].gameConsole}</div></div>`;
			gameCount++;
		} else {
				if (yearArr[game].yearReleased == pubDatesChoice) {	
					pubDatesGameList += `<div class="game"><div class="title">${yearArr[game].title}</div><div class="year">${yearArr[game]
                        .yearReleased}</div><div class="rating">Rating: ${yearArr[game].myRating}/10</div><div class="gameConsole">${yearArr[game].gameConsole}</div></div>`;
					gameCount++;
				}
			}
	}

	if(gameCount==1){
		gameWord = 'game';
	}

	$('.pubDateGames').html(`     
		<h3>${gameCount} ${gameWord}</h3>	
		<div class="gameList">${pubDatesGameList}</div>
    `);
}
//#endregion

/*===========================
	GAMES BY CATEGORY KEYWORD
===========================*/
//#region Keyword
function categorySetup() {
	let gameArr = JSON.parse(JSON.stringify(gameData));
	let keywords = [];
	for(let game in gameArr){
		if(gameArr[game].keywords != undefined){
			for(let i=0; i<gameArr[game].keywords.length; i++){
				if(!keywords.includes(gameArr[game].keywords[i])){
					keywords.push(gameArr[game].keywords[i]);
				}
			}
		}
	}
	
	keywords.sort(); 
	printCategories(keywords);
}

function printCategories(keywords) {
	let keywordStr = ``;
	for(let category in keywords) {
		keywordStr += `<option value="${keywords[category]}">${keywords[category]}</option>`
	}

	$('.categoryBox').html(`
			<label for="categorySelection" id="categoryLabel">Select a keyword</label>
			<select name="categorySelection" id="categorySelection" class="dataDrop">
				<option disabled selected>Keyword</option>          
				${keywordStr}
			</select>
			<div class="categoryGames"></div>
    `);
}

function displayCategory() {
	let categoryChoice = $('#categorySelection').val();
	let categoryGameList = ``;
	let gameCount = 0;
	let gameWord = 'games';
    

	for (let game in gameData) {
		if (gameData[game].keywords == undefined) {
		} else {
				if (gameData[game].keywords.includes(categoryChoice) == true) {	
					categoryGameList += `<div class="game"><div class="title">${gameData[game].title}</div><div class="year">${gameData[game]
                        .yearReleased}</div><div class="rating">Rating: ${gameData[game].myRating}/10</div><div class="gameConsole">${gameData[game].gameConsole}</div></div>`;
					gameCount++;
				}
			}
	}

	if(gameCount==1){
		gameWord = 'game';
	}
    
	$('.categoryGames').html(`     
		<h3>${gameCount} ${gameWord}</h3>	
		<div class="gameList">${categoryGameList}</div>
    `);
}
//#endregion

/*===========================
	GAMES BY MY RATING
===========================*/
//#region Rating
// Sorts all of the played games by rating

function rankSetup() {
	let gameArr = JSON.parse(JSON.stringify(gameData));
	let ranks = [];
	for(let game in gameArr){
		if(gameArr[game].myRating != undefined){
			if(!ranks.includes(gameArr[game].myRating)){
				ranks.push(gameArr[game].myRating);
			}
		}
	}
	
	ranks.sort((a, b) => b - a);
	printRanks(ranks);
}

function printRanks(ranks) {
	let rankStr = ``;
	for(let rank in ranks) {
		rankStr += `<option value="${ranks[rank]}">${ranks[rank]}</option>`
	}

	$('.rankBox').html(`
			<label for="rankSelection" id="rankLabel">Select a rating</label>
			<select name="rankSelection" id="rankSelection" class="dataDrop">
				<option disabled selected>Rating</option>          
				${rankStr}
			</select>
			<div class="rankGames"></div>
    `);
}

function displayRanks() {
	let rankChoice = $('#rankSelection').val();
	let rankGameList = ``;
	let gameCount = 0;
	let gameWord = 'games';


	for (let game in gameData) {
		if (gameData[game].myRating == undefined) {
		} else {
				if (gameData[game].myRating == rankChoice) {	
					rankGameList += `<div class="game"><div class="title">${gameData[game].title}</div><div class="year">${gameData[game]
                        .yearReleased}</div><div class="rating">Rating: ${gameData[game].myRating}/10</div><div class="gameConsole">${gameData[game].gameConsole}</div></div>`;
					gameCount++;

				}
			}
	}

	if(gameCount==1){
		gameWord = 'game';
	}

	$('.rankGames').html(`  
    <h3>${gameCount} ${gameWord}</h3>
		<div class="gameList">${rankGameList}</div>
    `);
}
//#endregion

/*===========================
	GAMES BY Console
===========================*/
//#region Keyword
function consoleSetup() {
	let gameArr = JSON.parse(JSON.stringify(gameData));
	let gameConsoleArr = [];
	for(let game in gameArr){
		if(gameArr[game].gameConsole != undefined){
			for(let i=0; i<gameArr[game].gameConsole.length; i++){
				if(!gameConsoleArr.includes(gameArr[game].gameConsole[i])){
					gameConsoleArr.push(gameArr[game].gameConsole[i]);
				}
			}
		}
	}
	
	gameConsoleArr.sort(); 
	printConsoles(gameConsoleArr);
}

function printConsoles(gameConsoleArr) {
	let gameConsoleStr = ``;
	for(let gameConsole in gameConsoleArr) {
		gameConsoleStr += `<option value="${gameConsoleArr[gameConsole]}">${gameConsoleArr[gameConsole]}</option>`
	}

	$('.consoleBox').html(`
			<label for="consoleSelection" id="consoleLabel">Select a keyword</label>
			<select name="consoleSelection" id="consoleSelection" class="dataDrop">
				<option disabled selected>Keyword</option>          
				${gameConsoleStr}
			</select>
			<div class="consoleGames"></div>
    `);
}

function displayConsole() {
	let consoleChoice = $('#consoleSelection').val();
	let consoleGameList = ``;
	let gameCount = 0;
	let gameWord = 'games';


	for (let game in gameData) {
		if (gameData[game].gameConsole == undefined) {
		} else {
				if (gameData[game].gameConsole.includes(consoleChoice) == true) {	
					consoleGameList += `<div class="game"><div class="title">${gameData[game].title}</div><div class="year">${gameData[game]
                        .yearReleased}</div><div class="rating">Rating: ${gameData[game].myRating}/10</div><div class="gameConsole">${gameData[game].gameConsole}</div></div>`;
					gameCount++;
				}
			}
	}

	if(gameCount==1){
		gameWord = 'game';
	}

	$('.consoleGames').html(`     
		<h3>${gameCount} ${gameWord}</h3>	
		<div class="gameList">${consoleGameList}</div>
    `);
}
//#endregion
