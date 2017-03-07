$(document).ready(function(){
	/*$.ajax({
	    url: "https://heisenbug-russian-league-live-scores-v1.p.mashape.com/api/russianleague/table",
	    type: 'GET',
	    data: {},
	    dataType: 'json',
	    success: function(data) { console.log(data); },
	    error: function(err) { alert(err); },
	    beforeSend: function(xhr) {
	    xhr.setRequestHeader("X-Mashape-Authorization", "dPqlI7wfAumsh5TvjJFC8weyaCSip1lseJUjsn1WyHgjTiEBwZ");
	    }
	});*/

	var matches;
	var newRow;
	var teamRow;
	function createNewRow(){
		newRow= $("<div>");
		newRow.addClass("row");
		$(".matchesDiv").append(newRow);
		return;
	}

	function printMatches(matchArray){
			var counter =0;
			createNewRow();

			for(var i =0; i < matchArray.length; i++){
				if(counter < 3){
					addMatch(matches[i]);
					counter ++;
				}
				else{
					createNewRow();
					addMatch(matches[i]);
					counter = 1;
					}
			}
			return;
		}

		function addMatch(arrayInput){
			var newMatch = $("<div>");
			newRow.append(newMatch);

			newMatch.addClass("col-md-4");
			var homeTeam = $("<h3>");
			homeTeam.html("Home Team: " + arrayInput.homeTeamName);
			newMatch.append(homeTeam);

			var awayTeam = $("<h3>");
			awayTeam.html("Away Team: " + arrayInput.awayTeamName);
			newMatch.append(awayTeam);

			return;
		}

		function createStandings(tableResponse){
			$("#leagueName").html(tableResponse.leagueCaption);

				for(var i=0; i < tableResponse.standing.length; i ++){
					teamRow = $("<tr>");

					teamAdd(tableResponse.standing[i], "position");
					teamAdd(tableResponse.standing[i], "teamName");
					teamAdd(tableResponse.standing[i], "playedGames");
					gamesAdd(tableResponse.standing[i], "wins", "draws", "losses");
					teamAdd(tableResponse.standing[i], "goalDifference");
					teamAdd(tableResponse.standing[i], "points");

					 $("#teamInsert").append(teamRow);
				}
				return;
		}

		function teamAdd(team, addition){
			var rowAddition = $("<td>");
			rowAddition.html(team[addition]);
			teamRow.append(rowAddition);
			return;
		}

		function gamesAdd(team, wins, draws, losses){
			var rowAddition = $("<td>");
			rowAddition.html(team[wins] + "-" + team[draws] + "-" + team[losses]);
			teamRow.append(rowAddition);
			return;
		}

	$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=27',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		matches = response.fixtures;
	  printMatches(matches);
	});

	$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
		createStandings(response);
	});

	/*$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/430/leagueTable',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
	console.log(response);
		createStandings(response);
	});*/

});
