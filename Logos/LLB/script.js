let logos = [];

async function fetchLogos() {
  const response = await fetch('../logos.json'); // Go up one directory to fetch logos.json
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Failed to fetch logos:', response.status, response.statusText);
    return [];
  }
}

async function initialize() {
  logos = await fetchLogos();
  populateLogoCards();
  populateDropdown();
}

function populateLogoCards() {
  const logoContainer = document.getElementById('logo-container');
  logos.forEach((logo) => {
    const logoCard = document.createElement('div');
    logoCard.className = 'logo-card';
  
    const logoNumber = document.createElement('p');
    logoNumber.innerText = `Logo ID: ${logo['Logo ID']}`;
  
    const logoImage = document.createElement('img');
    logoImage.className = 'logo-image';
    logoImage.src = logo['PNG'];
  
    logoCard.appendChild(logoNumber);
    logoCard.appendChild(logoImage);
    logoContainer.appendChild(logoCard);
  });
}

function populateDropdown() {
  const logoSelect = document.getElementById('logo-select');
  logos.forEach((logo) => {
    const option = document.createElement('option');
    option.value = logo['Logo ID'];
    option.innerText = `${logo['Description']} (${logo['Logo ID']})`;
    logoSelect.appendChild(option);
  });
}

document.getElementById('generate-pdf').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  
  const selectedLogos = Array.from(document.getElementById('logo-select').selectedOptions).map(option => option.value);
  
  let y = 10;
  for (const id of selectedLogos) {
    const logo = logos.find(logo => logo['Logo ID'] === parseInt(id));
    pdf.text(`Logo ID: ${logo['Logo ID']}`, 10, y);

    const imgData = await fetch(logo['PNG']).then(r => r.blob()).then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });

    pdf.addImage(imgData, 'PNG', 10, y + 10, 150, 150); // Adjusted dimensions to match CSS

    y += 170; // Move down the page for the next logo
  }
  
  pdf.save('logos.pdf');
});

$('#logo-select').select2();

// Initialize everything
initialize();
