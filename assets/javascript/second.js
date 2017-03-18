$(document).ready(function(){
  var currentMatchDay;
  var weekStarted;
  //tableGen object contains all the functions used to generate the league standings table
    var tableGen = {
      teamRow: "",
      //1/3 functions used to create league standings table
      createStandings: function(tableResponse){
        //takes legue name from JSON object and prints it in table header
        $("#leagueName").html("<h3>" + tableResponse.leagueCaption + "<br>Updated Through Matchday: " + tableResponse.matchday + "<h3>");

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

    //fixtureGen object contains all the functions used for generating the table of fixtures
var fixtureGen = {
  matchRow: "",

  //1/2 functions that print fixtures
  printMatches: function(matchArray){
    //takes matchDay from the JSOn object and prints it into header
    $("#matchDay").html("<h3>Matchday: " + currentMatchDay + "<h3>");

    //for each fixture prints into a table row before appending new row
    for(var i =0; i < matchArray.length; i++){
    fixtureGen.addMatch(matchArray[i], i );
    $("#fixtures").append(matchRow);
    }
    return;
  },

  //2/2 functions that print fixtures
  addMatch: function(arrayInput, data){
    matchRow = $("<tr>");
    newFixture = $("<td>");

    matchResults.matchCheck(arrayInput);
    if(weekStarted){
      if(arrayInput.status == "FINISHED"){
        newFixture.html("<span>FT: "+arrayInput.homeTeamName + " <b>" + arrayInput.result.goalsHomeTeam + "</b> VS "+ arrayInput.awayTeamName + "  <b>" + arrayInput.result.goalsAwayTeam + "</b></span>");
      }else{
        newFixture.html("<span data-game="+ data +"-H>"+ arrayInput.homeTeamName +"</span> vs <span data-game="+ data +"-A>" + arrayInput.awayTeamName + "</span>");
      };
    }else{
      newFixture.html("<span data-game="+ data +"-H>"+ arrayInput.homeTeamName +"</span> vs <span data-game="+ data +"-A>" + arrayInput.awayTeamName + "</span>");
    };

    //if fails this works
    //newFixture.html("<span data-game="+ data +"-H>"+ arrayInput.homeTeamName +"</span> vs <span data-game="+ data +"-A>" + arrayInput.awayTeamName + "</span>");

    matchRow.append(newFixture);
    $("#fixtures").append(matchRow);
    return;
  }
}

var matchResults = {
  printResults: function (matchArray){

    //generates the radiobuttons allowing for user picks
      $("#resultsHead").html("<h3>Results for matchday: " + matchArray[0].matchday + "</h3>");
      for(var i = 0; i <matchArray.length; i++){
          matchResults.addResult(matchArray[i], i);
      }
  },
  addResult: function(arrayInput, data){
    resultRow = $("<tr>");
    var newResult = $("<td>");
    if(arrayInput.status == "POSTPONED"){
      newResult.html("<span>PPD: " + arrayInput.homeTeamName + " VS "+ arrayInput.awayTeamName + "</span>");
      resultRow.append(newResult);
      $("#results").append(resultRow);
    }
    else if(arrayInput.status === "FINISHED"){
      newResult.html("<span>FT: "+arrayInput.homeTeamName + " <b>" + arrayInput.result.goalsHomeTeam + "</b> VS "+ arrayInput.awayTeamName + "  <b>" + arrayInput.result.goalsAwayTeam + "</b></span>");
      resultRow.append(newResult);
      $("#results").append(resultRow);
    }
    else{
      newResult.html("<span>TBP: "+ arrayInput.homeTeamName + " VS "+ arrayInput.awayTeamName + "</span>");
      resultRow.append(newResult);
      $("#results").append(resultRow);
    }
  },
  matchCheck: function(matchArray){
    weekStarted = false;
    for(var i = 0; i <matchArray.length; i++){
      if(matchArray[i].status === "FINISHED"){
        weekStarted = true;
      }
    }
    return weekStarted;
  }
}


  $.ajax({
    headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
    url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    currentMatchDay = response.matchday;
    var previousMatchDay = currentMatchDay -1;
      tableGen.createStandings(response);

      $.ajax({
        headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
        url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=' + currentMatchDay,
        dataType: 'json',
        type: 'GET',
      }).done(function(response) {
        console.log(response);
        fixtureGen.printMatches(response.fixtures);
      });

      $.ajax({
        headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
        url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=' + previousMatchDay,
        dataType: 'json',
        type: 'GET',
      }).done(function(response) {
        matchResults.printResults(response.fixtures);
      });

    });

});
