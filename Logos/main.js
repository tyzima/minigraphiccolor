// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 80; // 5x2 grid
let currentDisplayedLogos = []; 
let selectedBackgroundColor = "#f5f7fa";  // Default background color


const urlParams = new URLSearchParams(window.location.search);
const hideSearch = urlParams.get('hideSearch');
const teamNameParam = urlParams.get('teamName');
const favlogos = urlParams.get('favlogos');


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

document.body.style.backgroundColor = "#f5f7fa";


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
const urlToNavigate = `https://www.lax.ink/logos/?hideSearch=true&teamName=${encodeURIComponent(shortAccountName)}&bgColor=${encodeURIComponent(selectedBackgroundColor)}`;

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


    if (logo.VariationOf) {
      const variationOf = document.createElement('p');
      variationOf.style.position = 'absolute';  // Position it absolutely
      variationOf.style.bottom = '-12px';  // Move it down by 5 pixels
      variationOf.style.left = '0';  // Align it to the left
      variationOf.style.right = '0';  // Stretch it to the right
      variationOf.style.fontSize = '12px';
      variationOf.style.color = 'black';
      variationOf.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';  // Background color set to 50% white
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




  // Display Logo ID
  const logoID = document.createElement('div');
  logoID.textContent = logo['Logo ID'];
  logoID.className = 'logo-id';
  logoCard.appendChild(logoID);


  // Display Edit Colors Button only if hideSearch is not 'true'

if (hideSearch !== 'true') {
  const editColorsBtn = document.createElement('a');
  editColorsBtn.innerHTML = '<i class="material-icons">palette</i>';
  editColorsBtn.href = logo.LaxInkEditor2;
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

  // Inside your initApp function, after creating each logoCard
logoCard.addEventListener('click', function() {
  this.classList.toggle('selected');
});

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
      selectedBackgroundColor = hexCode;  
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
      const aLogoID = parseInt(a['Logo ID'], 10);  // Convert to integer for numerical comparison
      const aVariationOf = a['VariationOf'] || aLogoID;  // Use Logo ID if VariationOf is not set
      
      const bTeamName = b['Account Name'].toLowerCase();
      const bDescription = b['Description'].toLowerCase();
      const bLogoID = parseInt(b['Logo ID'], 10);  // Convert to integer for numerical comparison
      const bVariationOf = b['VariationOf'] || bLogoID;  // Use Logo ID if VariationOf is not set
    
      // Prioritize exact match for numbers
      if (aLogoID.toString() === query && bLogoID.toString() !== query) return -1;
      if (aLogoID.toString() !== query && bLogoID.toString() === query) return 1;
    
      // Prioritize by closeness of match for numbers
      if (aLogoID.toString().startsWith(query) && !bLogoID.toString().startsWith(query)) return -1;
      if (!aLogoID.toString().startsWith(query) && bLogoID.toString().startsWith(query)) return 1;
    
      // Group variations together
      if (aVariationOf !== bVariationOf) {
        return aVariationOf - bVariationOf;
      }
    
      // Within the same group, sort by highest Logo ID first
      if (aVariationOf === bVariationOf) {
        return bLogoID - aLogoID;
      }
    
      // Further prioritize by number, then by team name, then by description
      if (aLogoID.toString().includes(query) && !bLogoID.toString().includes(query)) return -1;
      if (!aLogoID.toString().includes(query) && bLogoID.toString().includes(query)) return 1;
      if (aTeamName.includes(query) && !bTeamName.includes(query)) return -1;
      if (!aTeamName.includes(query) && bTeamName.includes(query)) return 1;
      if (aDescription.includes(query) && !bDescription.includes(query)) return -1;
      if (!aDescription.includes(query) && bDescription.includes(query)) return 1;
    
      // Default sort by highest Logo ID if all else is equal
      return bLogoID - aLogoID;
    });
    
  
  // Reset to the first page and re-render the grid
  currentPage = 1;
  initApp(filteredAndSortedLogos);
});


function generateFileName(accountName) {
  return `${accountName}.LogoBook.jpg`;
}


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


document.getElementById('exportToJpg').addEventListener('click', async function() {
  const selectedCards = document.querySelectorAll('.logo-card.selected');
  
  if (selectedCards.length === 0) {
    alert('No cards selected.');
    return;
  }

  if (selectedCards.length > 9) {
    alert('🫸 9 Cards Per Page 🫷 ');
    return;
  }

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const scaleFactor = 2;  // Increase the resolution
  canvas.width = 800 * scaleFactor;
  canvas.height = 1100 * scaleFactor;
  const ctx = canvas.getContext('2d');
  ctx.scale(scaleFactor, scaleFactor);  // Apply the scale factor

  // Set background color to grey
  ctx.fillStyle = selectedBackgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// Load and draw the SVG header at the bottom
const headerImg = new Image();
headerImg.src = 'BannerLogo.svg';
await new Promise((resolve) => headerImg.onload = resolve);
ctx.drawImage(headerImg, -15, 0, canvas.width, headerImg.height * (canvas.width / headerImg.width));

const firstSelectedCard = selectedCards[0];
  const teamName = firstSelectedCard.querySelector('a').textContent; // Using accountName as the team name
  ctx.font = 'bold 20px Helvetica';
  ctx.fillStyle = 'lightgrey';
  ctx.fillText(teamName.toUpperCase(), 20, 40);

  // Draw 'LOGO BOOK (TODAY'S DATE)' below the team name
const today = new Date();
const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
ctx.font = 'bold 8px Arial';
ctx.fillText(`LOGO BOOK (${formattedDate})`, 20, 60);


  // Set text color to white
  ctx.fillStyle = 'white';

  let x = 50;
  let y = 115; // Initialize y coordinate

  for (const [index, card] of selectedCards.entries()) {
    const logoID = card.querySelector('.logo-id').textContent;
    const accountName = card.querySelector('a').textContent;
    const description = card.querySelector('p').textContent;
    const logoImg = card.querySelector('img');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoImg.src;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Calculate aspect ratio and new dimensions
    const aspectRatio = img.width / img.height;
    let newWidth = 200;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > 200) {
      newHeight = 200;
      newWidth = newHeight * aspectRatio;
    }

    // Calculate x and y offsets to center the image
    const xOffset = (200 - newWidth) / 2;
    const yOffset = (200 - newHeight) / 2;

    // Draw the image proportionally and centered
    ctx.drawImage(img, x + xOffset, y + yOffset, newWidth, newHeight);

    const pillWidth = 80;
  const pillHeight = 40;
  const pillX = x + 55;  // Adjust these values as needed
  const pillY = y + 220;
  const radius = 10;  // Radius for the rounded corners
  
  ctx.fillStyle = '#fefefe';
  ctx.beginPath();
  ctx.moveTo(pillX, pillY);
  ctx.lineTo(pillX + pillWidth, pillY);
  ctx.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
  ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
  ctx.lineTo(pillX + radius, pillY + pillHeight);
  ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
  ctx.lineTo(pillX, pillY);
  ctx.closePath();
  ctx.fill();

  // Add Logo ID text
  ctx.font = 'bold 20px Helvetica';
  ctx.fillStyle = '#0e2345';
  
  // Measure text width to center it
  const textWidth = ctx.measureText(logoID).width;
  const centerX = pillX + (pillWidth - textWidth) / 2;
  const centerY = pillY + (pillHeight + 8) / 2;  // The 8 is approximately half the font size
  
  ctx.fillText(logoID, centerX, centerY);
  



    // Update x and y coordinates
    x += 250;
    if ((index + 1) % 3 === 0) {
      x = 50;
      y += 300;
    }
  }

  const imgData = canvas.toDataURL('image/jpeg');
const link = document.createElement('a');
link.href = imgData;

// Set the download attribute using the generateFileName function
link.download = generateFileName(teamName);

link.click();
});

function goBack() {
  window.history.back();
}

