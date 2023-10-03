document.addEventListener("DOMContentLoaded", function() {
  fetch("../logos.json")
    .then(response => response.json())
    .then(data => {
      const logoContainer = document.getElementById("logo-container");
      const logoSelect = document.getElementById("logo-select");

      data.forEach(logo => {
        // Populate logo cards
        const logoCard = document.createElement("div");
        logoCard.className = "logo-card";
        const logoImage = document.createElement("img");
        logoImage.className = "logo-image";
        logoImage.src = logo.PNG;
        logoCard.appendChild(logoImage);
        logoContainer.appendChild(logoCard);

        // Populate dropdown
        const option = document.createElement("option");
        option.value = logo["Logo ID"];
        option.textContent = `${logo.Description} (${logo["Logo ID"]})`;
        logoSelect.appendChild(option);
      });

      // PDF generation
      document.getElementById("generate-pdf").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const selectedLogos = Array.from(logoSelect.selectedOptions).map(option => option.value);

        let y = 10;
        selectedLogos.forEach(id => {
          const selectedLogo = data.find(logo => logo["Logo ID"] === parseInt(id));
          pdf.text(`Logo ID: ${selectedLogo["Logo ID"]}`, 10, y);
          y += 20;  // Move down for the next logo
        });

        pdf.save("logos.pdf");
      });
    })
    .catch(error => console.error("Error fetching logos:", error));
});
