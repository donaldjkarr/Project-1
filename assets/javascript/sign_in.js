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

//object contains all the functions needed to generate a panel
var panelGen = {

  //this function creates initial panel, panel heading, and panel body.
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
  formGroup: function(inputId, formText, parentForm){
    var formGroup = $("<div>");
    formGroup.addClass("form-group");

    var formLabel = $("<label>");
    formLabel.attr("for", inputId);
    formLabel.html(formText);
    formGroup.append(formLabel);

    var userInput = $("<input>");
    userInput.addClass("form-control");
    userInput.attr("type", "text");
    userInput.attr("id", inputId);
    formGroup.append(userInput);

    parentForm.append(formGroup);
    return;
  },
//creates a submit button and attaches it to specified form
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

  createTable: function(tableId, parentForm){
    var newTable = $("<table>");
    newTable.addClass("table table-striped table-condensed");
    newTable.attr("id", tableId)
    parentForm.append(newTable);
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
    return
  },

  bodyAdd: function(info, parentBody){
    var bodyAdd = $("<td>");
    bodyAdd.html(info);
    parentBody.append(bodyAdd);
    return;
  }
}
  var userCount;
  database.ref("variables/").on("value", function(snapshot) {
      userCount = snapshot.val().userCount;
  });

  $("#signInBtn").on("click", function(){
    //prevents default and empties div to replace with sign in form
    event.preventDefault();
    $("#signInArea").empty();

    panelGen.createPanel("Please Sign In", "signInPanel", $("#signInArea"));
    formGen.createForm($("#signInPanel"), "signInForm");
    formGen.formGroup("nameInput", "User Name", $("#signInForm"));
    formGen.createSubmitBtn("nameSubmit", "Submit Name", $("#signInForm"));

  });

  $(document).on("click", "#nameSubmit", function(){
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
    database.ref("users/").push(newUser);

    $("#nameInput").val("");

    $("#signInArea").empty();
  });

  $('.carousel').carousel()


});
