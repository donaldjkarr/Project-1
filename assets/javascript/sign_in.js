$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyDsSl_sMP6qnwW8Wun2VkagkB5Xtv5B7A4",
    authDomain: "project-1-60d84.firebaseapp.com",
    databaseURL: "https://project-1-60d84.firebaseio.com",
    storageBucket: "project-1-60d84.appspot.com",
    messagingSenderId: "1033595008210"
  };
  firebase.initializeApp(config);

  $("#signInBtn").on("click", function(){
    //prevents default and empties div to replace with sign in form
    event.preventDefault();
    $("#signInArea").empty();

    var panel = $("<div>");
    panel.addClass("panel panel-primary");

    var panelHeading = $("<div>");
    panelHeading.addClass("panel-heading");
    panelHeading.html("<h3>Please Sign In<h3>");
    //panel heading is appended to panel
    panel.append(panelHeading);

    var panelBody = $("<div>");
    panelBody.addClass("panel-body");


    var signInForm = $("<form>");

      //these are all related to generating a form group and adding it to the form
      var formGroup = $("<div>");
      formGroup.addClass("form-group");

      var formLabel = $("<label>");
      formLabel.attr("for", "nameInput");
      formLabel.text("User Name")
      formGroup.append(formLabel);

      var nameInput = $("<input>");
      nameInput.addClass("form-control");
      nameInput.attr("type", "text");
      nameInput.attr("id", "nameInput");
      formGroup.append(nameInput);

    //form group is appended to form
    signInForm.append(formGroup);

    var nameSubmit =$("<button>");
    nameSubmit.addClass("btn btn-primary");
    nameSubmit.attr("id", "nameSubmit");
    nameSubmit.attr("type", "submit");
    nameSubmit.text("Submit Name");
    //submit button is appended to form
    signInForm.append(nameSubmit);

    //form is appended to panel body
    panelBody.append(signInForm);
    //panel body is appended to form
    panel.append(panelBody);
    //the panel now complete with heading and a body that contains the form is appended to sign in area
    $("#signInArea").append(panel);
  });
})
