$(document).ready(function() {
  $(".vote-up").submit(function(e) {
    e.preventDefault();

    var postId = $(this).data("id");
    $.ajax({
      type: "PUT",
      url: "reviews/" + postId + "/vote-up",
      success: function(data) {
        console.log("voted up!");
      },
      error: function(err) {
        console.log(err.messsage);
      }
    });
  });

  $(".vote-down").submit(function(e) {
    e.preventDefault();

    var postId = $(this).data("id");
    $.ajax({
      type: "PUT",
      url: "reviews/" + postId + "/vote-down",
      success: function(data) {
        console.log("voted down!");
      },
      error: function(err) {
        console.log(err.messsage);
      }
    });
  });
});

var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {  
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }
  
  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {  
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {  
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }
  
  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}

// Save data from editorjs
function myFunction(){
    editor.save().then((output) => {
        console.log('Data: ', output);
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}
