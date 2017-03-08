$(document).ready(function(){

  $("#signInBtn").on("click", function(){
  event.preventDefault();

  $("#signInArea").empty();
  var panel = $("<div>");
  panel.addClass("panel panel-primary")
  var panelHeading = $("<div>");
  panelHeading.addClass("panel-heading")
  panelHeading.html("<h3>Please Sign In<h3>");
  panel.append(panelHeading);
  var panelBody = $("<div>");
  panelBody.addClass("panel-body");

  var signInForm = $("<form>");

  var formGroup = $("<div>");
  formGroup.addClass("form-group");

  var formLabel = $("<label>");
  formLabel.attr("for", "nameInput");
  formGroup.append(formLabel);

  var nameInput = $("<input>");
  nameInput.addClass("form-control");
  nameInput.attr("type", "text");
  nameInput.attr("id", "nameInput");
  formGroup.append(nameInput);

  signInForm.append(formGroup);

  var nameSubmit =$("<button>");
  nameSubmit.addClass("btn btn-primary");
  nameSubmit.attr("id", "nameSubmit");
  nameSubmit.attr("type", "submit");
  nameSubmit.text("Submit Name");
  signInForm.append(nameSubmit);

  panelBody.append(signInForm);
  $("#signInArea").append(panelBody);
  });
})
