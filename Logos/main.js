// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 10; // 5x2 grid

// Function to handle pagination
function paginateItems(logos) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return logos.slice(startIndex, endIndex);
}

// Initialize the app
function initApp(logos) {
  // Clear existing cards
  const logoGrid = document.getElementById('logo-grid');
  logoGrid.innerHTML = '';

  const paginatedLogos = paginateItems(logos);
  
  paginatedLogos.forEach(logo => {
    const logoCard = document.createElement('div');
    logoCard.classList.add('logo-card');

    // Display Logo
    const logoImg = document.createElement('img');
    logoImg.src = logo.PNG;
    logoImg.style.maxWidth = '300px';
    logoCard.appendChild(logoImg);

    // Display Description
    const desc = document.createElement('p');
    desc.style.fontSize = '8px';
    desc.style.color = 'lightgrey';
    desc.textContent = logo.Description.toUpperCase();
    logoCard.appendChild(desc);

    // Display Logo ID
    const logoID = document.createElement('div');
    logoID.textContent = logo['Logo ID'];
    logoID.className = 'logo-id';
    logoCard.appendChild(logoID);

    // Display VariationOf
    if (logo.VariationOf) {
      const variationOf = document.createElement('p');
      variationOf.textContent = `Variation of: ${logo.VariationOf}`;
      logoCard.appendChild(variationOf);
    }

    // Display Team Name
    const teamName = document.createElement('p');
    teamName.style.fontSize = '12px';
    teamName.textContent = `Team Name: ${logo['Account Name']}`;
    logoCard.appendChild(teamName);

    // Display Edit Colors Button
    const editColorsBtn = document.createElement('a');
    editColorsBtn.textContent = 'Edit Colors';
    editColorsBtn.href = logo.LaxInkEditor;
    editColorsBtn.target = '_blank';
    logoCard.appendChild(editColorsBtn);

    // Display Color Helper
    const colorHelper = document.createElement('div');
    const colorSwatch = document.createElement('div');
    colorSwatch.style.width = '10px';
    colorSwatch.style.height = '10px';
    colorSwatch.style.borderRadius = '50%';
    colorSwatch.style.backgroundColor = logo.ColorHelper;
    colorHelper.appendChild(colorSwatch);
    logoCard.appendChild(colorHelper);

    logoGrid.appendChild(logoCard);
  });
}

// Initialize the color picker for background colors
function initColorPicker() {
  const colorPicker = document.getElementById('color-picker');
  const allowedColors = [
    "#c10230", "#85152B", "#7a303f", "#8a2432", "#c2502e", "#f13200",
    "#fde021", "#ffb71b", "#d0b787", "#124734", "#93d500", "#007934",
    "#85DFFF", "#79a3dc", "#6aaae4", "#004a98", "#002DAD", "#003595",
    "#12284c", "#532e7d", "#222223", "#9ea1a2", "#85714D", "#ffffff",
    "#333F48", "#373a36", "#6E6259", "#F1E6B2", "#4c372b", "#F99FC9",
    "#E31C79", "#cc5599", "#e3e829", "#005d70"
  ];

  allowedColors.forEach(hexCode => {
    const colorSwatch = document.createElement('div');
    colorSwatch.style.width = '20px';
    colorSwatch.style.height = '20px';
    colorSwatch.style.borderRadius = '50%';
    colorSwatch.style.backgroundColor = hexCode;
    colorSwatch.addEventListener('click', () => {
      document.body.style.backgroundColor = hexCode;
    });

    colorPicker.appendChild(colorSwatch);
  });
}

// Initialize with empty array
initApp([]);

// Fetch the logo data
let allLogos = [];
fetch('./Logos.JSON')
  .then(response => response.json())
  .then(data => {
    allLogos = data;
    // Initialize the app with paginated logo data
    initApp(paginateItems(allLogos));
  });

// Initialize the color picker with allowed background colors
initColorPicker();



// Search Functionality
// Search Functionality
const searchBox = document.getElementById('search-box');

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  
  const filteredLogos = allLogos.filter(logo => {
    const teamName = logo['Account Name'].toLowerCase();
    return teamName.includes(query);
  });
  
  // Reset to the first page and re-render the grid
  currentPage = 1;
  initApp(filteredLogos);
});



// Handle pagination
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    initApp(allLogos);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < Math.ceil(allLogos.length / itemsPerPage)) {
    currentPage++;
    initApp(allLogos);
  }
});