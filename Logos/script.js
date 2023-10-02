// Initialize the app
function initApp(logos) {
    const logoGrid = document.getElementById('logo-grid');
    
    logos.forEach(logo => {
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
      logoID.textContent = `Logo ID: ${logo['Logo ID']}`;
      logoID.style.borderRadius = '50%';
      logoID.style.position = 'absolute';
      logoID.style.top = '10px';
      logoID.style.left = '10px';
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
      "#12284c", "#532e7d", "#222223", "#9ea1a2", "#85714D", "#a2a9ad",
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
  
  // Fetch the logo data
  fetch('./Logos.JSON')
    .then(response => response.json())
    .then(data => {
      // Initialize the app with logo data
      initApp(data);
    });
  
  // Initialize the color picker with allowed background colors
  initColorPicker();
  
  // Search Functionality
  const searchBox = document.getElementById('search-box');
  
  searchBox.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const logoCards = document.querySelectorAll('.logo-card');
  
    logoCards.forEach(card => {
      const teamName = card.querySelector('p').textContent.toLowerCase();
      const description = card.querySelector('img').alt.toLowerCase();
      const logoID = card.querySelector('div').textContent.split(': ')[1];
  
      if (
        teamName.includes(query) ||
        description.includes(query) ||
        logoID.includes(query)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
  