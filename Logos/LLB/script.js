// Fetch logos data from '../logos.json'
fetch('../logos.json')
  .then(response => response.json())
  .then(data => populateDropdown(data));

// Populate dropdown
function populateDropdown(logosData) {
  const dropdown = document.getElementById('logoDropdown');
  const selectedLogosDiv = document.getElementById('selectedLogos');
  const choices = new Choices(dropdown, {
    removeItemButton: true,
    duplicateItemsAllowed: false,
  });

  const logoChoices = logosData.map((logo, index) => ({
    value: index,
    label: `${logo['Logo ID']} - ${logo.Description}`,
    selected: false,
    disabled: false,
  }));

  choices.setChoices(logoChoices, 'value', 'label', false);

  // Update selected logos display
  dropdown.addEventListener('choice', function(event) {
    const logo = logosData[event.detail.choice.value];
    const img = document.createElement('img');
    img.src = logo['PNG'];
    img.height = 50;
    selectedLogosDiv.appendChild(img);
  });

  // Save PDF
  document.getElementById('savePDF').addEventListener('click', async function() {
    const selectedIndices = choices.getValue(true).map(value => parseInt(value));
    const selectedLogos = selectedIndices.map(index => logosData[index]);
    const teamName = document.getElementById('teamName').value.toUpperCase();
    
    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    pdf.setFontSize(22);
    pdf.text(teamName, 10, 10);
    
    const imagePromises = selectedLogos.map((logo, i) => {
      return new Promise(async (resolve) => {
        const pageIndex = Math.floor(i / 9);
        const x = 20 + (i % 3) * 60;
        const y = 40 + (Math.floor(i / 3) % 3) * 60;
        
        if (i % 9 === 0 && i !== 0) {
          pdf.addPage();
          pdf.setFontSize(22);
          pdf.text(teamName, 10, 10);
        }
        
        // Draw a light grey rectangle with rounded corners as the background
        pdf.setFillColor(200, 200, 200); // light grey
        pdf.roundedRect(x - 2, y - 12, 54, 54, 3, 3, 'F');
        
        // Draw pill-shaped container for Logo ID
        pdf.setFillColor(255, 255, 255); // white
        pdf.roundedRect(x, y - 20, 30, 10, 5, 5, 'F');
        
        pdf.setFontSize(12);
        pdf.text(`${logo['Logo ID']}`, x + 5, y - 12);
        
        // Fetch the image and add it to the PDF
        const img = new Image();
        img.src = logo['PNG'];
        img.onload = async function() {
          const aspectRatio = img.width / img.height;
          const fixedWidth = 50;
          const calculatedHeight = fixedWidth / aspectRatio;
          
          const centerX = x + (fixedWidth - calculatedWidth) / 2;
          const centerY = y + (fixedWidth - calculatedHeight) / 2;
          
          const imgBlob = await fetch(logo['PNG']).then(r => r.blob());
          const reader = new FileReader();
          reader.readAsDataURL(imgBlob);
          reader.onloadend = function() {
            const base64data = reader.result;
            pdf.addImage(base64data, 'PNG', centerX, centerY, fixedWidth, calculatedHeight);
            resolve();
          };
        };
      });
    });
    
    await Promise.all(imagePromises);
    pdf.save(`${teamName}.pdf`);
  });
}



// Fetch logos data from '../logos.json'
fetch('../logos.json')
  .then(response => response.json())
  .then(data => populateDropdown(data));

// Populate dropdown
function populateDropdown(logosData) {
  const dropdown = document.getElementById('logoDropdown');
  const selectedLogosDiv = document.getElementById('selectedLogos');
  const savePDFButton = document.getElementById('savePDF');
  const choices = new Choices(dropdown, {
    removeItemButton: true,
    duplicateItemsAllowed: false,
  });

  const logoChoices = logosData.map((logo, index) => ({
    value: index,
    label: `${logo['Logo ID']} - ${logo.Description}`,
    selected: false,
    disabled: false,
  }));

  choices.setChoices(logoChoices, 'value', 'label', false);

  // Update selected logos display
  dropdown.addEventListener('choice', function(event) {
    const logo = logosData[event.detail.choice.value];
    const img = document.createElement('img');
    img.src = logo['PNG'];
    img.height = 50;
    selectedLogosDiv.appendChild(img);
  });

  // Save PDF
  savePDFButton.addEventListener('click', async function() {
    savePDFButton.disabled = true; // Disable the button to prevent multiple clicks
    savePDFButton.textContent = "Generating PDF..."; // Show loading text

    const selectedIndices = choices.getValue(true).map(value => parseInt(value));
    const selectedLogos = selectedIndices.map(index => logosData[index]);
    const teamName = document.getElementById('teamName').value.toUpperCase();
    
    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    pdf.setFontSize(22);
    pdf.text(teamName, 10, 10);
    
    
    const imagePromises = selectedLogos.map((logo, i) => {
      return new Promise(async (resolve) => {
        const pageIndex = Math.floor(i / 9);
        const x = 20 + (i % 3) * 60;
        const y = 40 + (Math.floor(i / 3) % 3) * 60;
        
        if (i % 9 === 0 && i !== 0) {
          pdf.addPage();
          pdf.setFontSize(22);
          pdf.text(teamName, 10, 10);
        }
        
        // Draw a light grey rectangle with rounded corners as the background
        pdf.setFillColor(200, 200, 200); // light grey
        pdf.roundedRect(x - 2, y - 12, 54, 54, 3, 3, 'F');
        
        // Draw pill-shaped container for Logo ID
        pdf.setFillColor(255, 255, 255); // white
        pdf.roundedRect(x, y - 5, 20, 10, 5, 5, 'F');
        
        pdf.setFontType('bold');
        pdf.setFontSize(15);
        pdf.text(`${logo['Logo ID']}`, x + 5, y - 12);



pdf.text(`${logo['Logo ID']}`, centeredX, y - 12 + 15); // y - 12 + 15 to move the text down by 15px
        
        // Fetch the image and add it to the PDF
        const img = new Image();
img.src = logo['PNG'];
img.onload = async function() {
  const aspectRatio = img.width / img.height;
  const containerWidth = 54 - 10; // 54 is the width of the grey box, 20 is the total padding (10px on each side)
  const containerHeight = 54 - 10; // 54 is the height of the grey box, 20 is the total padding (10px on each side)
  
  let logoWidth, logoHeight;

  if (aspectRatio > 1) {
    logoWidth = containerWidth;
    logoHeight = containerWidth / aspectRatio;
  } else {
    logoHeight = containerHeight;
    logoWidth = containerHeight * aspectRatio;
  }
  
  const centerX = x + 5 + (containerWidth - logoWidth) / 2;  // 10 is the left padding
  const centerY = y - 5 + (containerHeight - logoHeight) / 2;  // 10 is the top padding
  
  const imgBlob = await fetch(logo['PNG']).then(r => r.blob());
  const reader = new FileReader();
  reader.readAsDataURL(imgBlob);
  reader.onloadend = function() {
    const base64data = reader.result;
    pdf.addImage(base64data, 'PNG', centerX, centerY, logoWidth, logoHeight);
    resolve();
  };
};



      });
    });
    
    await Promise.all(imagePromises);
    pdf.save(`${teamName}.pdf`);

    savePDFButton.disabled = false; // Re-enable the button
    savePDFButton.textContent = "Save PDF"; // Reset button text
  });
}
