$(document).ready(function(){
  //initial configuration for firebase
  var config = {
    apiKey: "AIzaSyDsSl_sMP6qnwW8Wun2VkagkB5Xtv5B7A4",
    authDomain: "project-1-60d84.firebaseapp.com",
    databaseURL: "https://project-1-60d84.firebaseio.com",
    storageBucket: "project-1-60d84.appspot.com",
    messagingSenderId: "1033595008210"
  };


  firebase.initializeApp(config);
  var database = firebase.database();
  var currentUserUid;

  //function takes User information and puts onto firebase
  function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
      userName: name,
      email: email
    });
  }

//When User Submit button is pressed, submits the email and password to create a new account
 $(document).on("click", "#newUserSubmit", e =>{
 //btnSignUp.on("click", e => {
   event.preventDefault();
   const email = $("#emailInput").val().trim();
   const password = $("#passwordInput").val();
   const auth = firebase.auth();
   const userName = $("#nameInput").val().trim();

   const promise = auth.createUserWithEmailAndPassword(email, password);
   promise.catch(e => console.log(e.message));
   promise.then(function(){
     var userId = firebase.auth().currentUser.uid;
     //writeUserData(userId, name, email)
     writeUserData(userId, userName, email);
   })
 });

 //When Log in button is pressed, verifies if the user exists and logs them in.
 //They used e =>{} in the example video, this is the same as writing function(){}
  $(document).on("click", "#logInSubmit", e =>{
     event.preventDefault();
     const email = $("#emailInput").val().trim();
     const password = $("#passwordInput").val();
     const auth = firebase.auth();

     const promise = auth.signInWithEmailAndPassword(email, password);
     promise.catch(e => console.log(e.message));
   });

   //logs the current user out of firebase
   $(document).on("click", "#logOutBtn", e =>{
     currentUserUid = "";
     firebase.auth().signOut();
   })

   firebase.auth().onAuthStateChanged(firebaseUser => {
     //if user is logged in trigger if
     if(firebaseUser){
         $("#signInArea").empty();
       currentUserUid = firebase.auth().currentUser.uid;

       //panelGen.createPanel(panelTitle, bodyId, parentDiv)
       panelGen.createPanel("Top Players", "topPlayers" ,$("#signInArea"));

       //tableGen.createTable(tableId, parentPanel);
       tableGen.createTable("topTable", $("#topPlayers"));

       //tableGen.tableHeadInitial(headerId, parentTable);
       tableGen.tableHeadInitial("players", $("#topTable"));

       //tableGen.tableHeaders(headerText, tableHeaderId);
       tableGen.tableHeaders("User Name", $("#players"));

       //tableGen.tableBody(bodyId, parentTable);
       tableGen.tableBody("topBody", $("#topTable"));

       //anytime a user is added, this prints a table with all users.
       database.ref("users/").on("child_added", function(childSnapshot, prevChildKey){
         var tableRow = $("<tr>");
         var tableColumn = $("<td>");
         tableColumn.html(childSnapshot.val().userName);
         tableRow.append(tableColumn);
         $("#topBody").append(tableRow);
       });
     //adds a logOut button allowing user to logout
     var logOut = $("<button>");
     logOut.addClass("btn btn-primary btn-lg");
     logOut.attr("id", "logOutBtn");
     logOut.html("Log Out");
     $("#topPlayers").append(logOut);
     return;

   }
   //else statement triggers when no one is logged in
   else{
     //follows the same format as above, if there is not user logged in, the table of all users prints. with log in/sign up options at the bottom
     $("#signInArea").empty();
     //When the page loads, the leaderboard is populated with all of the users from firebase
     panelGen.createPanel("Top Players", "topPlayers" ,$("#signInArea"));
     tableGen.createTable("topTable", $("#topPlayers"));
     tableGen.tableHeadInitial("players", $("#topTable"));
     tableGen.tableHeaders("User Name", $("#players"));
     tableGen.tableBody("topBody", $("#topTable"));

     database.ref("users/").on("child_added", function(childSnapshot, prevChildKey){
       var tableRow = $("<tr>");
       var tableColumn = $("<td>");
       tableColumn.html(childSnapshot.val().userName);
       tableRow.append(tableColumn);
       $("#topBody").append(tableRow);
       return;
     });


     var logIn = $("<button>");
     logIn.addClass("btn btn-primary btn-lg");
     logIn.attr("id", "logInBtn");
     logIn.html("Log In");
     $("#topPlayers").append(logIn).append(" ");

     var signUp = $("<button>");
     signUp.addClass("btn btn-info btn-lg");
     signUp.attr("id", "signUpBtn");
     signUp.html("Sign Up");
     $("#topPlayers").append(signUp);
   }
   });


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

  //clicking log in button removes leaderboard and fills div with log in form
  $(document).on("click", "#logInBtn", function(){
    //prevents default and empties div to replace with sign in for
   event.preventDefault();
    $("#signInArea").empty();

    //panelGen.createPanel(panelTitle, bodyId, parentDiv)
    panelGen.createPanel("Please Sign In", "signInPanel", $("#signInArea"));

    //formGen.createForm(parentPanel, formId)
    formGen.createForm($("#signInPanel"), "signInForm");

    //formGen.formGroup(inputId, formText, type, parentForm)
    formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
    formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));
    
    //formGen.createSubmitBtn(btnId, btnText, parentForm)
    formGen.createSubmitBtn("logInSubmit", "Log In", $("#signInForm"));
  });

  //clicking sign up button removes leaderboard and fills div with new user form
  $(document).on("click", "#signUpBtn", function(){
    //prevents default and empties div to replace with sign up form
   event.preventDefault();
    $("#signInArea").empty();

    //panelGen.createPanel(panelTitle, bodyId, parentDiv)
    panelGen.createPanel("Please Sign In", "signInPanel", $("#signInArea"));

    //formGen.createForm(parentPanel, formId)
    formGen.createForm($("#signInPanel"), "signInForm");

    //formGen.formGroup(inputId, formText, type, parentForm)
    formGen.formGroup("nameInput", "User Name", "text", $("#signInForm"));
    formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
    formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));

    //formGen.createSubmitBtn(btnId, btnText, parentForm)
    formGen.createSubmitBtn("newUserSubmit", "Submit", $("#signInForm"));
  });

//creates a new user
  $(document).on("click", "#newUserSubmit", function(){
    event.preventDefault();
    //if user Sign in happens the auth state change function triggers
  });

});
