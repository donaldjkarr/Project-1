
//These global variables saves the list of matches so we can pull that data into a table later
//and takes the user's submitted picks and saves it to possibly push to firebase
//It also works in place of the data pulled from the user's account to build
//the web application while constructing user authentication.
$(document).ready(function(){
  //this array is the array of fixtures pulled from API
  var fixtures = [];

  //When a user is logged in, this variable is filled with their unique UID
  var currentUserUid;

  //default Matchday is 29.
  var currentMatchDay = 29;

  //This stores the fixtures for a given week as they are taken from firebase
  var firebaseFixtures;

  //pulled from Firebase, determines if a user has made picks
  var madePicks;

  //Holds the users picks for a given weeks fixtures
  var uidPicks;

  //Holds the points for a given user
  var userPoints;

  //gathers fixture object from firebase and updates each time API is called
  firebase.database().ref("matchday-" + currentMatchDay).on("value", function(snapshot){
    firebaseFixtures = snapshot.val().fixtures;
  });

  //function takes User information and puts onto firebase
  function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
      userName: name,
      email: email
    });
    return;
  }

  //function writes user selected choices into firebase
  function writeUserPicks(userId, userPicks) {
    var matchday = "matchday" + currentMatchDay;
    firebase.database().ref('picks/' + matchday + "/" + userId).set({
      userPicks
    });
    return;
  }

  //When User Submit button is pressed, submits the email and password to create a new account
  //changes authstate
  $(document).on("click", "#newUserSubmit", e =>{

   event.preventDefault();
   const email = $("#emailInput").val().trim();
   const password = $("#passwordInput").val();
   const auth = firebase.auth();
   const userName = $("#nameInput").val().trim();

   const promise = auth.createUserWithEmailAndPassword(email, password);

   //if creation of new user is not successful, error is logged to console.
   promise.catch(e => console.log(e.message));

   //if creation of new user is successful, user information is placed into firebase databse
   promise.then(function(){
     var userId = firebase.auth().currentUser.uid;
     //writeUserData(userId, name, email)
     writeUserData(userId, userName, email);

     firebase.database().ref("has_made_picks/"+userId).set({
       madePicks: "no"
     })
   })
  });

  //When Log in button is pressed, verifies if the user exists and logs them in.
  //changes authstate
  //They used e =>{} in the example video, this is the same as writing function(){}
  $(document).on("click", "#logInBtn", e =>{
     event.preventDefault();
     const email = $("#emailInput").val().trim();
     const password = $("#passwordInput").val();
     const auth = firebase.auth();

     //logs user in based on info, or console loges the error message.
     const promise = auth.signInWithEmailAndPassword(email, password);
     promise.catch(e => console.log(e.message));
   });

   //logs the current user out of firebase
   //resets user uid, user picks, and points
   $(document).on("click", "#logOutBtn", e =>{
     currentUserUid = "";
     uidPicks= [];
     userPoints= 0;
     madePicks = "no";
     firebase.auth().signOut();
   });

   $(document).on("click", "#signUpBtn", function(){
     //prevents default and empties div to replace with sign up form
    event.preventDefault();
     $("#picksPanel").empty();

     //panelGen.createPanel(panelTitle, bodyId, parentDiv)
     panelGen.createPanel("Please Sign In", "signInPanel", $("#picksPanel"));

     //formGen.createForm(parentPanel, formId)
     formGen.createForm($("#signInPanel"), "signInForm");

     //formGen.formGroup(inputId, formText, type, parentForm)
     formGen.formGroup("nameInput", "User Name", "text", $("#signInForm"));
     formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
     formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));

     //formGen.createSubmitBtn(btnId, btnText, parentForm)
     formGen.createSubmitBtn("newUserSubmit", "Submit", $("#signInForm"));
   });

   $(document).on("click", "#newUserSubmit", function(){
     event.preventDefault();
     //if user Sign in happens the auth state change function triggers
   });

   //This listens for auth state changes and displays accordingly
   firebase.auth().onAuthStateChanged(firebaseUser => {
     //if user is logged in this triggers
     if(firebaseUser){
       $("#userPointsDiv").empty();
       //panelGen.createPanel(panelTitle, bodyId, parentDiv)
       panelGen.createPanel("User Points:", "pointsPanel", $("#userPointsDiv"));
         $("#picksPanel").empty();

        //pulls user uid allowing for unique information to be stored on firebase
        currentUserUid = firebase.auth().currentUser.uid;
//TODO
//TODO
//TODO this doesnt work and produces an error with a new user, maybe cant use false
        firebase.database().ref("has_made_picks/"+ currentUserUid).on("value", function(snapshot){
          madePicks = snapshot.val().madePicks
        })


        //panelGen.createPanel(panelTitle, bodyId, parentDiv)
        panelGen.createPanel("Fixtures for matchday: " + currentMatchDay, "userPickPanel", $("#picksPanel"));

        //tableGen.createTable(tableId, parentPanel);
        tableGen.createTable("picksTable", $("#userPickPanel"));
        //tableGen.tableBody(bodyId, parentTable);
        tableGen.tableBody("userFixtures", $("#picksTable"));

        //generates the radiobuttons allowing for user picks
        if(firebaseFixtures){
          //if fixtures exist on firebase, they are pulled printed
          userChoice.printPicks(firebaseFixtures);
          if(madePicks === "yes"){
            firebase.database().ref("picks/matchday"+currentMatchDay+"/"+currentUserUid).on("value", function(snapshot){
              userResults.gamesFinished(firebaseFixtures);
              uidPicks = snapshot.val().userPicks;
              userResults.compare(userResults.matches, uidPicks);
              userResults.printPoints();
            });
          }
        }
        else{
          //if fixtures do not exist on firebase, the AJAx is called and they are printed from there
          $.ajax({
            headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
            url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
            dataType: 'json',
            type: 'GET',
          }).done(function(response) {
              currentMatchDay = response.matchday;
          //  tableGen.createStandings(response);
              $.ajax({
                 headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
                 url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=' + currentMatchDay,
                 dataType: 'json',
                 type: 'GET',
              }).done(function(response) {
                fixtures = response.fixtures;
                firebase.database().ref("matchday-" + currentMatchDay+"/").set({
                  fixtures
                });
                userChoice.printPicks(fixtures);

                if(madePicks === "yes"){
                  firebase.database().ref("picks/matchday"+currentMatchDay+"/"+currentUserUid).on("value", function(snapshot){
                    uidPicks = snapshot.val().userPicks;
                    userResults.gamesFinished(fixtures);
                    userResults.compare(userResults.matches, uidPicks);
                    userResults.printPoints();
                  });
                }
              });
            });
        }

        //submit picks button is printed if user is logged in
        var submitPicksBtn = $("<button>");
        submitPicksBtn.addClass("btn btn-primary btn-lg");
        submitPicksBtn.attr("id", "submitPicks");
        submitPicksBtn.html("Submit");
        $("#userPickPanel").append(submitPicksBtn).append(" ");

        //users also have the option of logging out.
        var logOut = $("<button>");
        logOut.addClass("btn btn-secondary btn-lg");
        logOut.attr("id", "logOutBtn");
        logOut.html("Log Out");
        $("#userPickPanel").append(logOut);
     }
     //else statement triggers when no one is logged in
     else{
       $("#userPointsDiv").empty();
       //panelGen.createPanel(panelTitle, bodyId, parentDiv)
       panelGen.createPanel("User Points:", "pointsPanel", $("#userPointsDiv"));
       //follows the same format as above, if there is not user logged in, the table of all users prints. with log in/sign up options at the bottom
        $("#picksPanel").empty();

        //panelGen.createPanel(panelTitle, bodyId, parentDiv)
        panelGen.createPanel("Please Sign In", "signInPanel", $("#picksPanel"));

        //formGen.createForm(parentPanel, formId)
        formGen.createForm($("#signInPanel"), "signInForm");

        //formGen.formGroup(inputId, formText, type, parentForm)
        formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
        formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));

       var logIn = $("<button>");
       logIn.addClass("btn btn-primary btn-lg");
       logIn.attr("id", "logInBtn");
       logIn.html("Log In");
       $("#signInForm").append(logIn).append(" ");

       var signUp = $("<button>");
       signUp.addClass("btn btn-info btn-lg");
       signUp.attr("id", "signUpBtn");
       signUp.html("Sign Up");
       $("#signInForm").append(signUp);
     }

   });

  var userChoice = {
    printPicks: function(matchArray){
      //createForm: function(parentPanel, formId)
      formGen.createForm($("#userPickPanel"), "radioChoices");
      //for each fixture prints into a table row before appending new row
      for(var i =0; i < matchArray.length; i++){
        userChoice.addPick(matchArray[i], i);
      }
      return;
    },

    addPick: function(arrayInput, data){
      var pickRow = $("<tr>");
      var newPick = $("<td>");

      var homeTeam = $("<span>");
      homeTeam.html(arrayInput.homeTeamName + " <input type='radio' name=matchNum:"+ data+" data-match=" + data + " value='" + arrayInput.homeTeamName + "'>  ");
      newPick.append(homeTeam);

      var awayTeam = $("<span>");
      awayTeam.html(arrayInput.awayTeamName + " <input type='radio' name=matchNum:"+ data+" data-match=" + data + " value='" + arrayInput.awayTeamName + "'>  ");
      newPick.append(awayTeam);

      var draw = $("<span>");
      draw.html("Draw <input type='radio' name=matchNum:"+ data+" data-match=" + data + " value='Draw'>");
      newPick.append(draw);

      pickRow.append(newPick);
      $("#userFixtures").append(pickRow);
    return;
    },

    submitPick: function(matchArray){
      var submittedPicks =[];
      for(var i = 0; i < matchArray.length; i++){
        $.each($("input[data-match=" + i + "]:checked"), function(){
          var userPicks = {
            matchId: $(this).attr("data-match"),
            matchPick: $(this).val()
          }
          submittedPicks.push(userPicks);
        });
      }

      writeUserPicks(currentUserUid, submittedPicks);
      firebase.database().ref("has_made_picks/"+currentUserUid).set({
        madePicks: "yes"
      })
      firebase.database().ref("picks/matchday"+currentMatchDay+"/"+currentUserUid).on("value", function(snapshot){
        uidPicks = snapshot.val().userPicks;
        console.log(uidPicks);
      });
      return;
    }
  }

  var matchResults = {
    printResults: function (matchArray){
      //panelGen.createPanel(panelTitle, bodyId, parentDiv)
      panelGen.createPanel("Results for matchday: " + matchArray[0].matchday, "resultsPanel", $("#finalResults"));

      //tableGen.createTable(tableId, parentPanel);
      tableGen.createTable("resultsTable", $("#resultsPanel"));
      //tableGen.tableBody(bodyId, parentTable);
      tableGen.tableBody("fixtureResults", $("#resultsTable"));

      //generates the radiobuttons allowing for user picks
        $("#finalresults").html("Matchday " + matchArray[0].matchday + " Results");
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
        $("#fixtureResults").append(resultRow);
      }
      else if(arrayInput.status === "FINISHED"){
        newResult.html("<span>FT: "+arrayInput.homeTeamName + " <b>" + arrayInput.result.goalsHomeTeam + "</b> VS "+ arrayInput.awayTeamName + "  <b>" + arrayInput.result.goalsAwayTeam + "</b></span>");
        resultRow.append(newResult);
        $("#fixtureResults").append(resultRow);
      }
      else{
        newResult.html("<span>"+ arrayInput.homeTeamName + " VS "+ arrayInput.awayTeamName + "</span>");
        resultRow.append(newResult);
        $("#fixtureResults").append(resultRow);
      }
    },
    matchCheck: function(matchArray){
      var weekStarted = false;
      for(var i = 0; i <matchArray.length; i++){
        if(matchArray[i].status === "FINISHED"){
          weekStarted = true;
        }
      }
      return weekStarted;
    }
  }

  var userResults = {
    matches: [],
    //This compares the user's choices with that the actual results
    compare: function(matchesArray, uidPicks){
      console.log(uidPicks[1].matchPick);
      if(userPoints){
        for(var i = 0; i < matchesArray.length; i++){
          console.log("userPoints exists in the loop")
          if(matchesArray[i] == "POSTPONED"){
          }
          else if(matchesArray[i] == uidPicks[i].matchPick){
            if(matches[i] === "Draw"){
              userPoints++;
            }
            else{
              userPoints += 3;
            }
          }
        }
        firebase.database().ref("points/"+currentUserUid).set({
          userPoints: userPoints
        })
      }
      else{
        var pointCounter = 0;
        for(var i = 0; i < matchesArray.length; i++){;
          if(matchesArray[i] == "POSTPONED"){
          }
          if(matchesArray[i] == uidPicks[i].matchPick){
            if(matches[i] == "Draw"){
              pointCounter++;
            }
            else{
              pointCounter += 3;
            }
          }
        }
        userPoints = pointCounter;
        firebase.database().ref("points/"+currentUserUid).set({
        userPoints: pointCounter
        })
      }
    },

    gamesFinished: function(fixtureArray){
      //Run through fixtures array to check results
      for(var i = 0; i < fixtureArray.length; i++){
        //If the game is finished
        if(fixtureArray[i].status === "FINISHED"){
            if(fixtureArray[i].result.goalsAwayTeam > fixtureArray[i].result.goalsHomeTeam){
              userResults.matches.push(fixtures[i].awayTeamName);
            }
            else if(fixtureArray[i].result.goalsAwayTeam < fixtureArray[i].result.goalsHomeTeam){
              userResults.matches.push(fixtures[i].homeTeamName);
            }
            else if(fixtureArray[i].result.goalsAwayTeam == fixtureArray[i].result.goalsHomeTeam){
              userResults.matches.push("Draw");
            }
        }
        else if(fixtureArray[i].status === "POSTPONED"){
          userResults.matches.push("POSTPONED");
        }
        else if(fixtureArray[i].status === "TIMED"){
          userResults.matches.push("TIMED");
        }
      }
      return;
    },
    //This prints the points to HTML
    printPoints: function(){
      $("#userPointsDiv").empty();
      //panelGen.createPanel(panelTitle, bodyId, parentDiv)
      panelGen.createPanel("User Points:", "pointsPanel", $("#userPointsDiv"));

      var newPoints = $("<div>");
      newPoints.html("<span><H3>" + userPoints + "</H3></span>");
      $("#pointsPanel").append(newPoints);
      return;
    }
  }

//Takes pick options and uploads attaches them to the username.
  $(document).on("click", "#submitPicks", function(){
    event.preventDefault();
      userChoice.submitPick(firebaseFixtures);
  });



    //API call to obtain fixtures for a specified match day
    //This actually calls object and object runs functions

  //API call to obtain the league table
  $.ajax({
    headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
    url: 'http://api.football-data.org/v1/competitions/426/leagueTable',
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
      currentMatchDay = response.matchday;
      var previousMatchDay = response.matchday - 1;
  //  tableGen.createStandings(response);
      $.ajax({
	       headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
	       url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=' + currentMatchDay,
	       dataType: 'json',
	       type: 'GET',
	    }).done(function(response) {
          fixtures = response.fixtures;
          firebase.database().ref("matchday-" + currentMatchDay+"/").set({
            fixtures
          });
          if(matchResults.matchCheck(fixtures)){
            matchResults.printResults(fixtures);
          }
          else{
            $.ajax({
              headers: { 'X-Auth-Token': '183f8b1674a443d3b81e71fa06e8ac24' },
              url: 'http://api.football-data.org/v1/competitions/426/fixtures?matchday=' + previousMatchDay,
              dataType: 'json',
              type: 'GET',
            }).done(function(response) {
              matchResults.printResults(response.fixtures);
            });
          }
        });

    });

        /*$("#picksPanel").empty();
       currentUserUid = firebase.auth().currentUser.uid;

       //panelGen.createPanel(panelTitle, bodyId, parentDiv)
       panelGen.createPanel("Fixtures", "userPickPanel", $("#picksPanel"));

       //tableGen.createTable(tableId, parentPanel);
       tableGen.createTable("picksTable", $("#userPickPanel"));
       //tableGen.tableBody(bodyId, parentTable);
       tableGen.tableBody("userFixtures", $("#picksTable"));

       userPicks.printPicks(response.fixtures);

       var submitPicksBtn = $("<button>");
       submitPicksBtn.addClass("btn btn-primary btn-lg");
       submitPicksBtn.attr("id", "submitPicks");
       submitPicksBtn.html("Submit");
       $("#userPickPanel").append(submitPicksBtn).append(" ");

       var logOut = $("<button>");
       logOut.addClass("btn btn-secondary btn-lg");
       logOut.attr("id", "logOutBtn");
       logOut.html("Log Out");
       $("#userPickPanel").append(logOut);
        //fixtureGen.printMatches(response.fixtures);
        //userPicks.printPicks(response.fixtures);
        //gamesFinished(response.fixtures);
      matchResults.printResults(response.fixtures);*/

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

//object contains all the functions needed to generate a panel
var panelGen = {
  //Creates the initial panel and places it within a specified parent element
  createPanel: function(panelTitle, bodyId, parentDiv){
    var panel = $("<div>");
    panel.addClass("panel panel-primary");

    var panelHeading = $("<div>");
    panelHeading.addClass("panel-heading");
    panelHeading.html("<h3>" + panelTitle + "<h3>");
    //panel heading is appended to panel
    panel.append(panelHeading);

    var panelBody = $("<div>");
    panelBody.addClass("panel-body");
    panelBody.attr("id", bodyId);
    panel.append(panelBody);

    parentDiv.append(panel);
    return;
  }
}

//this object contains all the functions necessary to generate a form
var formGen = {

  //this function creates the initial form
  createForm: function(parentPanel, formId){
    var newForm = $("<form>");
    newForm.attr("id", formId)
    parentPanel.append(newForm);
    return;
  },

  //creates a form group and attaches it to specified form
  formGroup: function(inputId, formText, type, parentForm){
    var formGroup = $("<div>");
    formGroup.addClass("form-group");

    var formLabel = $("<label>");
    formLabel.attr("for", inputId);
    formLabel.html(formText);
    formGroup.append(formLabel);

    var userInput = $("<input>");
    userInput.addClass("form-control");
    userInput.attr("type", type);
    userInput.attr("id", inputId);
    formGroup.append(userInput);

    parentForm.append(formGroup);
    return;
  },
  //creates a submit button at the bottom of the form
  createSubmitBtn: function(btnId, btnText, parentForm){
    var btnSubmit =$("<button>");
    btnSubmit.addClass("btn btn-primary");
    btnSubmit.attr("id", btnId);
    btnSubmit.attr("type", "submit");
    btnSubmit.html(btnText);
    //submit button is appended to form
    parentForm.append(btnSubmit);
    return;
    }
  }

//this object contains all the functions necessary to generate a table
var tableGen ={
  //Creates the initial table
  createTable: function(tableId, parentPanel){
    var newTable = $("<table>");
    newTable.addClass("table table-striped table-condensed");
    newTable.attr("id", tableId)
    parentPanel.append(newTable);
    return;
  },

  //creates the table header row
  tableHeadInitial: function(headerId, parentTable){
    var tableHead =$("<thead>");
    var tableHeaderRow = $("<tr>");
    tableHeaderRow.attr("id", headerId)
    tableHead.append(tableHeaderRow);
    parentTable.append(tableHead);
    return;
  },
  //creates the column headings and append them to the table header row
  tableHeaders: function(headerText, tableHeaderId){
    var tableHeader = $("<th>");
    tableHeader.html(headerText);
    tableHeaderId.append(tableHeader);
    return;
  },

  //creates the table's body and appends it to the parent table
  tableBody: function(bodyId, parentTable){
    var tableBody = $("<tbody>");
    tableBody.attr("id", bodyId);
    parentTable.append(tableBody);
    return
  },

  //creates a single row that us appended to the parent table
  tableRow: function(rowId, parentBody){
    var tableRow = $("<tr>");
    tableRow.attr("id", rowId);
    parentBody.append(tableRow);
    return;
  },
//populates a parent row with a column
  rowAddition: function(info, rowId){
    var rowAdd = $("<td>");
    rowAdd.html(info);
    rowId.append(rowAdd);
    return;
  }
}

});
