
//These global variables saves the list of matches so we can pull that data into a table later
//and takes the user's submitted picks and saves it to possibly push to 
var matches = [];
var submittedPicks = [];

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
      fixtureGen.addMatch(matchArray[i], i );
      $("fixtures").append(matchRow);
      }
      return;
    },

    //2/2 functions that print fixtures
    addMatch: function(arrayInput, data){
      matchRow = $("<tr>");
      var newFixture = $("<td>");
      newFixture.html("<span data-game="+ data +"-H>"+ arrayInput.homeTeamName +"</span> vs <span data-game="+ data +"-A>" + arrayInput.awayTeamName + "</span>");
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

  var userPicks = {
    printPicks: function(matchArray){
      //takes matchDay from the JSOn object and prints it into header
      $("#matchdaypicks").html("Matchday: " + matchArray[0].matchday);

      //for each fixture prints into a table row before appending new row
      for(var i =0; i < matchArray.length; i++){
        userPicks.addPick(matchArray[i], i);
        $("userpick").append(pickRow);
      }
      return;
    },

    addPick: function(arrayInput, data){
      pickRow = $("<tr>");
      var newPick = $("<td>");
      newPick.html("<span>"+ arrayInput.homeTeamName + " <input type='radio' name='radioRow" + data +"' value='" + arrayInput.homeTeamName + "'>  " + "</span>" + "<span>" + arrayInput.awayTeamName + " <input type='radio' name='radioRow" + data +"' value='" + arrayInput.awayTeamName + "'>  " + "</span>" + "<span>" + "Draw" + " <input type='radio' name='radioRow" + data + "' value='DRAW'></span>");
      pickRow.append(newPick);
      $("#userpick").append(pickRow);
      return;
    },

    submitPick: function(matchArray){
      for(var i = 0; i < matchArray.length; i++){
        $.each($("input[name='radioRow" + i + "']:checked"), function(){
          submittedPicks.push($(this).val());
          console.log($(this).val());
        });
      }
    }
  }

  var matchResults = {
    printResults: function (matchArray){
        $("#finalresults").html("Matchday " + matchArray[0].matchday + " Results");
        for(var i = 0; i <matchArray.length; i++){
            matchResults.addResult(matchArray[i], i);
            
        }
    },
    addResult: function(arrayInput, data){
      console.log(arrayInput);
      resultRow = $("<tr>");
      var newResult = $("<td>");
      if(arrayInput.status == "POSTPONED"){
        newResult.html("<span> POSTPONED </span>");
        resultRow.append(newResult);
        $("#final").append(resultRow);  
      }
      else{
        newResult.html("<span>"+arrayInput.homeTeamName + " " + arrayInput.result.goalsHomeTeam + " VS "+ arrayInput.awayTeamName + " " + arrayInput.result.goalsAwayTeam + "</span>");
        resultRow.append(newResult);
        $("#final").append(resultRow);
      } 
    },

  }

  var userResults = {

    pointCount: 0,
    //This compares the user's choices with that the actual results
    compare: function(){

    },
    //This prints the points to HTML
    printPoints: function(){

    }
  }

//Takes pick options and uploads attaches them to the username.
  $("#submitPicks").on("click", function(){
      submittedPicks = [];
      userPicks.submitPick(matches);
      userResults.compare();
      userResults.printPoints();  
  });


    //API call to obtain fixtures for a specified match day 
    //This actually calls object and object runs functions
  $.ajax({
    headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
    url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=28',
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    console.log(response);
    fixtureGen.printMatches(response.fixtures);
    userPicks.printPicks(response.fixtures);
    gamesFinished(response.fixtures);
    matchResults.printResults(response.fixtures);
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


function gamesFinished (fixtures){
  //Check variable
  console.log("GAMES FINISHED:  " + fixtures);
  //Run through fixtures array to check results
  for(var i = 0; i < fixtures.length; i++){
    //If the game is finished
    console.log(fixtures[i].status);
    if(fixtures[i].status === "FINISHED"){
        if(fixtures[i].result.goalsAwayTeam > fixtures[i].result.goalsHomeTeam){
          matches.push(fixtures[i].awayTeamName);
        }
        if(fixtures[i].result.goalsAwayTeam < fixtures[i].result.goalsHomeTeam){
          matches.push(fixtures[i].homeTeamName);
        }
        if(fixtures[i].result.goalsAwayTeam == fixtures[i].result.goalsHomeTeam){
          matches.push("Draw");
        }
    }
    if(fixtures[i].status === "POSTPONED"){
          matches.push("POSTPONED");
    }
      console.log(matches);
  }
}
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
