// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 80; // 5x2 grid
let currentDisplayedLogos = []; 

const urlParams = new URLSearchParams(window.location.search);
const hideSearch = urlParams.get('hideSearch');
const teamNameParam = urlParams.get('teamName');

// Hide the search bar if the URL parameter is present
if (hideSearch === 'true') {
  document.getElementById('search-box').style.display = 'none';
}

// Pre-fill the search bar and trigger the search function if the URL parameter is present
if (teamNameParam) {
  const searchBox = document.getElementById('search-box');
  searchBox.value = teamNameParam;
  // Trigger your existing search logic here
  const event = new Event('input', {
    'bubbles': true,
    'cancelable': true
  });
  searchBox.dispatchEvent(event);
}


// Function to handle pagination
function paginateItems(logos) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return logos.slice(startIndex, endIndex);
}

document.body.style.backgroundColor = "#f4f4f4";

function initApp(logos) {
  // Clear existing cards
  const logoGrid = document.getElementById('logo-grid');
  logoGrid.innerHTML = '';

  const paginatedLogos = paginateItems(logos);

  let logoContainer = null; // New container for every 8 logos

  paginatedLogos.forEach((logo, index) => {
    // Create a new container for every 8 logos
    if (index % 8 === 0) {
      logoContainer = document.createElement('div');
      logoContainer.classList.add('logo-container');
      logoGrid.appendChild(logoContainer);
    }

    const logoCard = document.createElement('div');
    logoCard.classList.add('logo-card');
    logoCard.classList.add('hidden');  // Add the 'hidden' class here
// Display Team Name

const teamName = document.createElement('a');  // Change 'p' to 'a'
teamName.style.fontSize = '10px';
let accountName = logo['Account Name'];
const shortAccountName = accountName.slice(0, 15);  // Only take the first 15 characters

// Prepare the URL
const urlToNavigate = `https://www.lax.ink/logos/?hideSearch=true&teamName=${encodeURIComponent(shortAccountName)}`;

// Update the href attribute to navigate to the page
teamName.href = urlToNavigate;

if (accountName.length > 25) {
  accountName = accountName.slice(0, 22) + '...';  // Slice to 22 characters and add ellipsis
}
teamName.textContent = accountName;

// Add click event to copy URL
teamName.addEventListener('click', function(event) {
  // Use the Clipboard API to silently copy the text
  navigator.clipboard.writeText(urlToNavigate).catch(err => {
    console.error('Could not copy text: ', err);
  });
});

logoCard.appendChild(teamName);

    // Display Description
    const desc = document.createElement('p');
    desc.style.fontSize = '9px';
    desc.style.color = 'lightgrey';
    desc.textContent = logo.Description.toUpperCase();
    logoCard.appendChild(desc);

    // Display Logo ID
    const logoID = document.createElement('div');
    logoID.textContent = logo['Logo ID'];
    logoID.className = 'logo-id';
    logoCard.appendChild(logoID);

    if (logo.VariationOf) {
      const variationOf = document.createElement('p');
      variationOf.style.position = 'absolute';  // Position it absolutely
      variationOf.style.bottom = '-12px';  // Move it down by 5 pixels
      variationOf.style.left = '0';  // Align it to the left
      variationOf.style.right = '0';  // Stretch it to the right
      variationOf.style.fontSize = '12px';
      variationOf.style.color = 'black';
      variationOf.style.backgroundColor = 'lightgrey';
      variationOf.style.padding = '5px 10px';
      variationOf.style.borderRadius = '0 0 15px 15px';  // Rounded corners only at the bottom
      variationOf.textContent = `Variation of: ${logo.VariationOf}`;
      logoCard.appendChild(variationOf);
    }
    
   
    const logoImg = document.createElement('img');

    // Modify the SVG URL to PNG URL
    const pngUrl = `https://res.cloudinary.com/laxdotcom/image/upload/b_none/${logo['Account ID']}/${logo['Account ID']}.${logo['Logo ID']}.png`;

    logoImg.src = pngUrl;
    logoCard.appendChild(logoImg);


 // Display Edit Colors Button only if hideSearch is not 'true'
if (hideSearch !== 'true') {
  const editColorsBtn = document.createElement('a');
  editColorsBtn.innerHTML = '<i class="material-icons">palette</i>';
  editColorsBtn.href = logo.LaxInkEditor;
  editColorsBtn.target = '_blank';
  logoCard.appendChild(editColorsBtn);
}




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
    currentDisplayedLogos = logos;
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
    "#E31C79", "#cc5599", "#005d70"
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

    // Check if there's a team name in the URL parameters
    const teamNameParam = urlParams.get('teamName');
    if (teamNameParam) {
      const searchBox = document.getElementById('search-box');
      searchBox.value = teamNameParam;

      // Trigger the search logic here
      const event = new Event('input', {
        'bubbles': true,
        'cancelable': true
      });
      searchBox.dispatchEvent(event);
    }
  });


// Initialize the color picker with allowed background colors
initColorPicker();





// Search Functionality
const searchBox = document.getElementById('search-box');

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  
  const filteredAndSortedLogos = allLogos
    .filter(logo => {
      const teamName = logo['Account Name'].toLowerCase();
      const description = logo['Description'].toLowerCase();
      const logoID = logo['Logo ID'].toString();
      
      return teamName.includes(query) || description.includes(query) || logoID.includes(query);
    })
    .sort((a, b) => {
      const aTeamName = a['Account Name'].toLowerCase();
      const aDescription = a['Description'].toLowerCase();
      const aLogoID = a['Logo ID'].toString();
      
      const bTeamName = b['Account Name'].toLowerCase();
      const bDescription = b['Description'].toLowerCase();
      const bLogoID = b['Logo ID'].toString();

      // Prioritize exact match for numbers
      if (aLogoID === query && bLogoID !== query) return -1;
      if (aLogoID !== query && bLogoID === query) return 1;

      // Prioritize by closeness of match for numbers
      if (aLogoID.startsWith(query) && !bLogoID.startsWith(query)) return -1;
      if (!aLogoID.startsWith(query) && bLogoID.startsWith(query)) return 1;

      // Further prioritize by number, then by team name, then by description
      if (aLogoID.includes(query) && !bLogoID.includes(query)) return -1;
      if (!aLogoID.includes(query) && bLogoID.includes(query)) return 1;
      if (aTeamName.includes(query) && !bTeamName.includes(query)) return -1;
      if (!aTeamName.includes(query) && bTeamName.includes(query)) return 1;
      if (aDescription.includes(query) && !bDescription.includes(query)) return -1;
      if (!aDescription.includes(query) && bDescription.includes(query)) return 1;

      return 0;
    });
  
  // Reset to the first page and re-render the grid
  currentPage = 1;
  initApp(filteredAndSortedLogos);
});


document.getElementById('printButton').addEventListener('click', () => {
  window.print();
});




document.addEventListener('contextmenu', function(event) {
  if (event.target.tagName === 'SVG') {
    event.preventDefault();
  }
});

document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    initApp(paginateItems(currentDisplayedLogos));
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < Math.ceil(currentDisplayedLogos.length / itemsPerPage)) {
    currentPage++;
    initApp(paginateItems(currentDisplayedLogos));
  }
});
