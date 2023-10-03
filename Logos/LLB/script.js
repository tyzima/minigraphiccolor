document.addEventListener("DOMContentLoaded", function() {
  fetch("../logos.json")
    .then(response => response.json())
    .then(data => {
      const logoSelect = document.getElementById("logo-select");

      // Sort logos by VariationOf and Logo ID
      data.sort((a, b) => (a.VariationOf || a["Logo ID"]) - (b.VariationOf || b["Logo ID"]));

      data.forEach(logo => {
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

        let x = 10;
        let y = 10;
        let count = 0;

        selectedLogos.forEach(id => {
          const selectedLogo = data.find(logo => logo["Logo ID"] === parseInt(id));
          pdf.text(`Logo ID: ${selectedLogo["Logo ID"]}`, x, y);
          y += 30;  // Move down for the next logo
          count++;

          if (count >= 9) {
            pdf.addPage();
            x = 10;
            y = 10;
            count = 0;
          }
        });

        pdf.save("logos.pdf");
      });
    })
    .catch(error => console.error("Error fetching logos:", error));
});
