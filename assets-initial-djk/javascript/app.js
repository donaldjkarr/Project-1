$(document).ready(function(){
  //Initial older API, still might need to be used
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
	var newRow;
	var teamRow;

  //function prints each fixture into a row of the table
	function printMatches(matchArray){
    $("#matchDay").html("Matchday: " + matchArray[0].matchday);

    for(var i =0; i < matchArray.length; i++){
		addMatch(matchArray[i]);
    $("fixtures").append(newRow);
    }
		return;
	}

    //print matches takes this input to creat each row
		function addMatch(arrayInput){
			newRow = $("<tr>");
      var newFixture = $("<td>");
      newFixture.html(arrayInput.homeTeamName + " vs " + arrayInput.awayTeamName);
			newRow.append(newFixture);
      $("#fixtures").append(newRow);
			return;
		}

    //creates league table
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

    //Adds team to function that generates the table
		function teamAdd(team, addition){
			var rowAddition = $("<td>");
			rowAddition.html(team[addition]);
			teamRow.append(rowAddition);
			return;
		}
    //W-D-L takes special function
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
    console.log(response);
	  printMatches(response.fixtures);
	});

	$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
    console.log(response);
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
