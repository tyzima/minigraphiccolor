let colorData = []; // Initialize empty array for color data
let currentPage = 1;
const itemsPerPage = 10;
let filteredData = [];

// Fetch the JSON data to populate colorData
fetch('ColorData.json')
  .then(response => response.json())
  .then(data => {
    colorData = data;
    filteredData = [...colorData];
    renderCurrentPage(); // Initialize the first page once data is loaded
  });

function renderCards(data) {
  const colorGrid = document.getElementById('colorGrid');
  colorGrid.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'color-card';

    const colorName = document.createElement('h2');
    colorName.textContent = item['Color Name'];
    colorName.className = 'color-name';
    card.appendChild(colorName);

    const middleDiv = document.createElement('div');
    middleDiv.className = 'middle-div';

    const image = document.createElement('img');
    image.src = item['ImageURL'];
    image.alt = item['Color Name'];
    middleDiv.appendChild(image);

    const brandsOverlay = document.createElement('div');
    brandsOverlay.className = 'brands-overlay';
    item['Brands'].split(',').forEach(b => {
      if (b.trim() !== '') {
        const pill = document.createElement('span');
        pill.className = 'color-pill brands-pill';
        pill.textContent = b;
        brandsOverlay.appendChild(pill);
      }
    });
    middleDiv.appendChild(brandsOverlay);
    card.appendChild(middleDiv);

    const tooltipHolder = document.createElement('div');
    tooltipHolder.className = 'tooltip-holder';

    const printability = document.createElement('div');
    printability.className = 'icon-container';

    const iconMap = {
      'Heat Press': 'https://res.cloudinary.com/laxdotcom/image/upload/v1695849884/HPff_c2swhd.svg',
      'Screen Print': 'https://res.cloudinary.com/laxdotcom/image/upload/v1695849878/SPff_ftlboo.svg',
      'Embroidery': 'https://res.cloudinary.com/laxdotcom/image/upload/v1695849917/Embff_xjyfos.svg',
      'Decals': 'https://res.cloudinary.com/laxdotcom/image/upload/v1695849891/Decalff_spgcgu.svg'
    };

    item['Printability'].split(',').forEach(p => {
      if (p.trim() !== '') {
        const icon = document.createElement('img');
        icon.className = 'printability-icon';
        icon.src = iconMap[p.trim()];
        icon.alt = p.trim();

        const iconWithTooltip = document.createElement('div');
        iconWithTooltip.className = 'icon-with-tooltip';
        iconWithTooltip.appendChild(icon);

        iconWithTooltip.onmouseover = () => {
          tooltipHolder.textContent = p.trim();
        };

        printability.appendChild(iconWithTooltip);
      }
    });

    card.appendChild(printability);
    card.appendChild(tooltipHolder); // Append Tooltip Holder to the card
    colorGrid.appendChild(card);
  });
}

function updatePaginationControls(totalItems) {
  const paginationControls = document.getElementById('paginationControls');
  paginationControls.innerHTML = '';

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const prevButton = document.createElement('button');
  prevButton.className = 'page-button';
  prevButton.innerHTML = '<i class="material-icons">navigate_before</i>';
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderCurrentPage();
    }
  };
  paginationControls.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.className = 'page-button';
  nextButton.innerHTML = '<i class="material-icons">navigate_next</i>';
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCurrentPage();
    }
  };
  paginationControls.appendChild(nextButton);
}

function renderCurrentPage() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  renderCards(filteredData.slice(start, end));
  updatePaginationControls(filteredData.length);
}

function filterData(query) {
  filteredData = colorData.filter(item => {
    return Object.values(item).some(val =>
      String(val).toLowerCase().includes(query.toLowerCase())
    );
  });

  currentPage = 1;
  renderCurrentPage();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  filterData(e.target.value);
});

// Place this code after your existing code

// Event Listeners for Filter Buttons
document.getElementById('filterPrintability').addEventListener('click', () => {
  applyFilters('Printability', 'Embroidery');
});

document.getElementById('filterBrands').addEventListener('click', () => {
  applyFilters('Brands', 'Nike');
});

document.getElementById('filterColor').addEventListener('click', () => {
  applyFilters('Color Name', 'Red');
});



// RGB to Lab conversion and CIE76 distance calculation functions
// ... (Include the rgbToLab and cie76 functions here)

// Function to Apply Filters
function applyFilters() {
  const printabilityValue = document.getElementById('filterPrintability').value;
  const brandsValue = document.getElementById('filterBrands').value;
  const colorValue = document.getElementById('filterColor').value;

  // Filtering based on printability and brands
  filteredData = colorData.filter(item => {
    let valid = true;

    if (printabilityValue && !item['Printability'].includes(printabilityValue)) {
      valid = false;
    }

    if (brandsValue && !item['Brands'].includes(brandsValue)) {
      valid = false;
    }

    return valid;
  });

  // Additional filtering based on color
  if (colorValue) {
    const selectedColorName = colorValue.toLowerCase();

    filteredData = filteredData.map(item => {
      let similarity = 0; // Initialize a similarity score

      // Check if the color name contains the selected color name
      if (item['Color Name'].toLowerCase().includes(selectedColorName)) {
        similarity = 100; // Max similarity score for exact matches in name
      } else {
     function rgbToLab(r, g, b){
  let x, y, z;

  r /= 255, g /= 255, b /= 255;
  [r, g, b] = [r, g, b].map(v => v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92);
  [r, g, b] = [r * 100, g * 100, b * 100];
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 95.047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 100.000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 108.883;

  [x, y, z] = [x, y, z].map(v => v > 0.008856 ? Math.pow(v, 1/3) : (v * 903.3 + 16) / 116);

  const l = (116 * y) - 16;
  const a = (x - y) * 500;
  const b2 = (y - z) * 200;

  return [l, a, b2];
}

function cie76(color1, color2){
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}
      }

      return { ...item, similarity }; // Append the similarity score to the item
    });

    // Sort by similarity score in descending order
    filteredData.sort((a, b) => b.similarity - a.similarity);

    // Remove items with a similarity score of 0
    filteredData = filteredData.filter(item => item.similarity > 0);
  }

  currentPage = 1; // Reset to the first page
  renderCurrentPage(); // Re-render the grid
}

// Event Listeners for Filter Dropdowns
document.getElementById('filterPrintability').addEventListener('change', applyFilters);
document.getElementById('filterBrands').addEventListener('change', applyFilters);
document.getElementById('filterColor').addEventListener('change', applyFilters);
