document.getElementById("enter-button").addEventListener("click", function() {
    const input = document.getElementById("password-input").value;
  
    if (input === "norwalk") {
      window.location.href = "http://www.lax.ink/logos";
    } else {
      alert("Wrong password!");
    }
  });
  