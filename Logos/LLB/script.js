// Fetch logos data from '../logos.json'
fetch('../logos.json')
  .then(response => response.json())
  .then(data => populateDropdown(data));

// Populate dropdown
function populateDropdown(logosData) {
  const dropdown = document.getElementById('logoDropdown');
  const choices = new Choices(dropdown, {
    removeItemButton: true,
    duplicateItemsAllowed: false,
  });

  logosData.forEach((logo, index) => {
    choices.setChoices([
      { value: index, label: `${logo['Logo ID']} - ${logo.Description}`, selected: false, disabled: false },
    ], 'value', 'label', true);
  });

  // Save PDF
  document.getElementById('savePDF').addEventListener('click', async function() {
    const selectedLogos = Array.from(dropdown.selectedOptions).map(option => logosData[option.value]);
    const teamName = document.getElementById('teamName').value.toUpperCase();
    
    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    pdf.setFontSize(22);
    pdf.text(teamName, 10, 10);
    
    // Add logos to PDF
    for (let i = 0; i < selectedLogos.length; i++) {
      const logo = selectedLogos[i];
      const pageIndex = Math.floor(i / 9);
      const x = 20 + (i % 3) * 60;
      const y = 40 + (Math.floor(i / 3) % 3) * 60;
      
      if (i % 9 === 0 && i !== 0) {
        pdf.addPage();
        pdf.setFontSize(22);
        pdf.text(teamName, 10, 10);
      }
      
      pdf.setFontSize(12);
      pdf.text(`${logo['Logo ID']}`, x, y - 10);
      
      // Fetch the image and add it to the PDF
      const img = await fetch(logo['PNG']).then(r => r.blob());
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = function() {
        const base64data = reader.result;
        pdf.addImage(base64data, 'PNG', x, y, 50, 50);
        
        if (i === selectedLogos.length - 1) {
          pdf.save(`${teamName}.pdf`);
        }
      };
    }
  });
}
