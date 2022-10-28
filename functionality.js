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

//#endregion

//#region Hide/Show

// Hides all elements
function makeHidden() {
	$('.allGames').hide();
	$('.consoleBox').hide();
}

// Shows the selected section and runs its function
function displayData() { 
	switch($('#dataSelection').val()){
		case 'all':
			allGames(1);
			break;
		case 'rankedBtn':
			allGames(2);
			break;
		case 'pubDate':
			allGames(3);
			break;
		case 'console':
			consoleSetup();	
			$('.consoleBox').show();
			break;
	}
	
	setGradient();
}
//#endregion

/*===========================
	ALL GAMES PLAYED
===========================*/
//#region All Games
// Pulls all of the games and displays them
function allGames(sortingNum) {
	let allGames = ``;
	let gamesForAll = 0;

	$('.allGames').show();

	let gameArr = JSON.parse(JSON.stringify(gameData));

	if (sortingNum == 2){
		gameArr.sort(function(a, b) {
			return b.myRating - a.myRating;
		});	
	} else if (sortingNum == 3){
		gameArr.sort(function(a, b) {
			return b.yearReleased - a.yearReleased;
		});	
	}

	for (let game in gameArr) {
		allGames += `<div class="game"><div class="title">${gameArr[game].title}</div><div class="year">${gameArr[game]
			.yearReleased}</div><div class="rating">Rating: ${gameArr[game].myRating}/10</div><div class="gameConsole">${gameArr[game].gameConsole}</div></div>`;
		gamesForAll += 1;
		gameArr[game].id = game;
	}

	$('.allGames').html(`     
			<h3>${gamesForAll} games</h3>
			<div class="gameList">${allGames}</div>
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

	let consoleGameList = ``;
	let gameCounts = {};

	for(let gameConsole in gameConsoleArr){
		consoleGameList += `<div class="consoleTitle" id="${gameConsoleArr[gameConsole]}">${gameConsoleArr[gameConsole]}<span class="countNum"></span></div>`
		for (let game in gameData) {
			if (gameData[game].gameConsole == undefined) {
			} else {
					if (gameData[game].gameConsole.includes(gameConsoleArr[gameConsole]) == true) {	
						consoleGameList += `<div class="game"><div class="title">${gameData[game].title}</div><div class="year">${gameData[game]
							.yearReleased}</div><div class="rating">Rating: ${gameData[game].myRating}/10</div><div class="gameConsole">${gameData[game].gameConsole}</div></div>`;
							gameCounts[gameConsoleArr[gameConsole]] = (gameCounts[gameConsoleArr[gameConsole]] + 1) || 1;
					}
					
				}
		}
	}

	$('.consoleBox').html(`
			<div class="consoleGames">
				<div class="gameList">${consoleGameList}</div>
			</div>
    `);

	for(let gameConsole in gameConsoleArr){
		$(`#${gameConsoleArr[gameConsole]}`).html(`
			${gameConsoleArr[gameConsole]}<span class="countNum">${gameCounts[gameConsoleArr[gameConsole]]}</span>
		`);
	}
}
//#endregion
