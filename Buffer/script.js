// Function to check password and redirect
function checkPasswordAndRedirect() {
    const input = document.getElementById("password-input").value;
  
    if (input === "norwalk") {
      window.location.href = "http://www.lax.ink/logos";
    } else {
      alert("Wrong password!");
    }
  }
  
  // Event listener for click on the "enter" button
  document.getElementById("enter-button").addEventListener("click", checkPasswordAndRedirect);
  
  // Event listener for "Enter" key
  document.getElementById("password-input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      checkPasswordAndRedirect();
    }
  });
  