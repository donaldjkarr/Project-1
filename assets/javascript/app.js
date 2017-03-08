$(document).ready(function(){

  var config = {
      apiKey: "AIzaSyDsSl_sMP6qnwW8Wun2VkagkB5Xtv5B7A4",
      authDomain: "project-1-60d84.firebaseapp.com",
      databaseURL: "https://project-1-60d84.firebaseio.com",
      storageBucket: "project-1-60d84.appspot.com",
      messagingSenderId: "1033595008210"
    };
    firebase.initializeApp(config);

  //fixtureGen object contains all the functions used for generating the table of fixtures
  var fixtureGen = {
    matchRow: "",

    //1/2 functions that print fixtures
    printMatches: function(matchArray){
      //takes matchDay from the JSOn object and prints it into header
      $("#matchDay").html("Matchday: " + matchArray[0].matchday);

      //for each fixture prints into a table row before appending new row
      for(var i =0; i < matchArray.length; i++){
      fixtureGen.addMatch(matchArray[i]);
      $("fixtures").append(matchRow);
      }
      return;
    },

    //2/2 functions that print fixtures
    addMatch: function(arrayInput){
      matchRow = $("<tr>");
      var newFixture = $("<td>");
      newFixture.html(arrayInput.homeTeamName + " vs " + arrayInput.awayTeamName);
      matchRow.append(newFixture);
      $("#fixtures").append(matchRow);
      return;
    }
  }

//tableGen object contains all the functions used to generate the league standings table
  var tableGen = {
    teamRow: "",
    //1/3 functions used to create league standings table
    createStandings: function(tableResponse){
      //takes legue name from JSON object and prints it in table header
			$("#leagueName").html(tableResponse.leagueCaption + "<br>Updated Through Matchday: " + tableResponse.matchday);

      //for each team in the JSON object, for loop adds each element("wins, team name, etc) to a table row and appends the row to the table")
				for(var i=0; i < tableResponse.standing.length; i ++){
					teamRow = $("<tr>");

					tableGen.teamAdd(tableResponse.standing[i], "position");
					tableGen.teamAdd(tableResponse.standing[i], "teamName");
					tableGen.teamAdd(tableResponse.standing[i], "playedGames");
					tableGen.AddWDL(tableResponse.standing[i], "wins", "draws", "losses");
					tableGen.teamAdd(tableResponse.standing[i], "goalDifference");
					tableGen.teamAdd(tableResponse.standing[i], "points");

					 $("#teamInsert").append(teamRow);
				}
				return;
		},

    //2/3 functions used to create league standings table
    //Adds a particular element to the table row. (first parameter takes the specific team, second is addition to the table)
		teamAdd: function(team, addition){
			var rowAddition = $("<td>");
			rowAddition.html(team[addition]);
			teamRow.append(rowAddition);
			return;
		},

    //3/3 function used to create league standings table
    //essentially the same as teamAdd(), has more parameters allowing all three parts of the object to be added to a single column of the table
		AddWDL: function(team, wins, draws, losses){
			var rowAddition = $("<td>");
			rowAddition.html(team[wins] + "-" + team[draws] + "-" + team[losses]);
			teamRow.append(rowAddition);
			return;
		}
  }


    //API call to obtain fixtures for a specified match day
	$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=27',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
    console.log(response);
	  fixtureGen.printMatches(response.fixtures);
	});

  //API call to obtain the league table
	$.ajax({
	  headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	  url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
    console.log(response);
		tableGen.createStandings(response);
	});


/*Competition # and corresponding league
  2016/2017 season
  426: Premier League
  430: Bundesliga
  434: French Ligue 1
  436: La Liga
  438: Italian Serie A
  440: UEFA Champions League
*/

//Working example of initial older API, still might need to be used
//limited to 50 calls per month
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

});
