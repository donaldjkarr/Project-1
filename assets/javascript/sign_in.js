$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyDsSl_sMP6qnwW8Wun2VkagkB5Xtv5B7A4",
    authDomain: "project-1-60d84.firebaseapp.com",
    databaseURL: "https://project-1-60d84.firebaseio.com",
    storageBucket: "project-1-60d84.appspot.com",
    messagingSenderId: "1033595008210"
  };

  firebase.initializeApp(config);
  var database = firebase.database();
//TODO:Need to add change for auth state with this function
//TODO:need to remove User count and generate a seperate object for username and allow that to be used for logging in
//TODO: With User UID should be possible to save picks off to databse by specific user.

  /*firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      $("#changingPanel").empty();
        var additionForm = $("<form>");
        additionForm.attr("id", "addForm");
        $("#changingPanel").append(additionForm);

        inputContent("trainName", "Train Name:", $("#addForm"));
        inputContent("destination", "Destination:", $("#addForm"));
        inputContent("firstTime", "First Train:", $("#addForm"));
        inputContent("frequency", "Frequency:", $("#addForm"));

        buttonGen("newTrainBtn", "Submit", $("#addForm"), "primary");
        buttonGen("logOut", "Log Out", $("#addForm"), "secondary");
    }
  });*/

 $(document).on("click", "#logInSubmit", e =>{
  //btnLogIn.on("click", e => {
    event.preventDefault();
    const email = $("#emailInput").val().trim();
    const password = $("#passwordInput").val();
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);

    promise.catch(e => console.log(e.message));
  });

 $(document).on("click", "#newUserSubmit", e =>{
 //btnSignUp.on("click", e => {
   event.preventDefault();
   const email = $("#emailInput").val().trim();
   const password = $("#passwordInput").val();
   const auth = firebase.auth();

   const promise = auth.createUserWithEmailAndPassword(email, password);

   promise.catch(e => console.log(e.message));
 });



//object contains all the functions needed to generate a panel
var panelGen = {
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

var formGen = {

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

var tableGen ={

  createTable: function(tableId, parentPanel){
    var newTable = $("<table>");
    newTable.addClass("table table-striped table-condensed");
    newTable.attr("id", tableId)
    parentPanel.append(newTable);
    return;
  },

  tableHeadInitial: function(headerId, parentTable){
    var tableHead =$("<thead>");
    var tableHeaderRow = $("<tr>");
    tableHeaderRow.attr("id", headerId)
    tableHead.append(tableHeaderRow);
    parentTable.append(tableHead);
    return;
  },

  tableHeaders: function(headerText, tableHeaderId){
    var tableHeader = $("<th>");
    tableHeader.html(headerText);
    tableHeaderId.append(tableHeader);
    return;
  },

  tableBody: function(bodyId, parentTable){
    var tableBody = $("<tbody>");
    tableBody.attr("id", bodyId);
    parentTable.append(tableBody);
    return
  },

  tableRow: function(rowId, parentBody){
    var tableRow = $("<tr>");
    tableRow.attr("id", rowId);
    parentBody.append(tableRow);
    return;
  },

  rowAddition: function(info, rowId){
    var rowAdd = $("<td>");
    rowAdd.html(info);
    rowId.append(rowAdd);
    return;
  }
}

  var userCount;
  database.ref("variables/").on("value", function(snapshot) {
      userCount = snapshot.val().userCount;
  });

  $(document).on("click", "#signInBtn", function(){
    //prevents default and empties div to replace with sign in form
   event.preventDefault();
    $("#signInArea").empty();

    panelGen.createPanel("Please Sign In", "signInPanel", $("#signInArea"));
    formGen.createForm($("#signInPanel"), "signInForm");
    formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
    formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));
    formGen.createSubmitBtn("logInSubmit", "Log In", $("#signInForm"));

  });

  $(document).on("click", "#signUpBtn", function(){
    //prevents default and empties div to replace with sign in form
   event.preventDefault();
    $("#signInArea").empty();

    panelGen.createPanel("Please Sign In", "signInPanel", $("#signInArea"));
    formGen.createForm($("#signInPanel"), "signInForm");
    formGen.formGroup("nameInput", "User Name", "text", $("#signInForm"));
    formGen.formGroup("emailInput", "Email", "email", $("#signInForm"));
    formGen.formGroup("passwordInput", "Password", "password", $("#signInForm"));
    formGen.createSubmitBtn("newUserSubmit", "Submit", $("#signInForm"));

  });

  $(document).on("click", "#newUserSubmit", function(){
    event.preventDefault();

    userCount++
    database.ref("variables/").set({
        userCount: userCount
      });

    var newUser = {
      userName: name,
      uid: userCount
    }

    newUser.userName = $("#nameInput").val().trim();
    //newUser.uid = userCount;
    $("#signInArea").empty();
    panelGen.createPanel("Top Players", "topPlayers" ,$("#signInArea"));
    tableGen.createTable("topTable", $("#topPlayers"));
    tableGen.tableHeadInitial("players", $("#topTable"));
    tableGen.tableHeaders("User Name", $("#players"));
    tableGen.tableBody("topBody", $("#topTable"));
    database.ref("users/").push(newUser);

  });
  panelGen.createPanel("Top Players", "topPlayers" ,$("#signInArea"));
  tableGen.createTable("topTable", $("#topPlayers"));
  tableGen.tableHeadInitial("players", $("#topTable"));
  tableGen.tableHeaders("User Name", $("#players"));
  tableGen.tableBody("topBody", $("#topTable"));

  database.ref("users/").on("child_added", function(snapshot){

    /*  var sv = snapshot.val();
      // Getting an array of each key In the snapshot object
      var svArr = Object.keys(sv);
      // Finding the last user's key
      var lastIndex = svArr.length - 1;
      var lastKey = svArr[lastIndex];
      // Using the last user's key to access the last added user object
      var lastObj = sv[lastKey]
      // Console.loging the last user's data
      console.log(lastObj.name);
      console.log(lastObj.email);
      console.log(lastObj.age);
      console.log(lastObj.comment); */

    var tableRow = $("<tr>");
    var tableColumn = $("<td>");
    tableColumn.html(snapshot.val().userName);
    tableRow.append(tableColumn);
    $("#topBody").append(tableRow);
    return;
  });
  var logIn = $("<button>");
  logIn.addClass("btn btn-primary btn-lg");
  logIn.attr("id", "signInBtn");
  logIn.html("Log In");
  $("#topPlayers").append(logIn).append(" ");

  var signUp = $("<button>");
  signUp.addClass("btn btn-info btn-lg");
  signUp.attr("id", "signUpBtn");
  signUp.html("Sign Up");
  $("#topPlayers").append(signUp);

});
