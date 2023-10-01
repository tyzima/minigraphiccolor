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
if (item['Brands']) {
  item['Brands'].split(',').forEach(b => {
    const pill = document.createElement('span');
    pill.className = 'color-pill brands-pill';
    if (b.trim() === '') {
      pill.className += ' empty-pill'; // Add extra class for empty pill
      pill.textContent = 'Premium';  // Unicode for non-breaking space
    } else {
      pill.textContent = b;
    }
    brandsOverlay.appendChild(pill);
  });
} else {
  // If no brands data, add an empty pill to occupy space
  const emptyPill = document.createElement('span');
  emptyPill.className = 'color-pill brands-pill';
  emptyPill.textContent = 'Premium';  // Unicode for non-breaking space
  brandsOverlay.appendChild(emptyPill);
}
middleDiv.appendChild(brandsOverlay);

    card.appendChild(middleDiv);

    const tooltipHolder = document.createElement('div');
    tooltipHolder.className = 'tooltip-holder';

    const printability = document.createElement('div');
    printability.className = 'icon-container';

    const iconMap = {
      'Heat Press': 'https://res.cloudinary.com/laxdotcom/image/upload/v1696036182/fire-solid_fkq9ga.svg',
      'Screen Print': 'https://res.cloudinary.com/laxdotcom/image/upload/v1696036193/fill-drip-solid_mzutgg.svg',
      'Embroidery': 'https://res.cloudinary.com/laxdotcom/image/upload/v1696036188/xmarks-lines-solid_vgpzxs.svg',
      'Decals': 'https://res.cloudinary.com/laxdotcom/image/upload/v1696036199/dochub_wvd0gm.svg'
    };


    item['Printability'].split(',').forEach(p => {
      if (p.trim() !== '') {
        const icon = document.createElement('img');
        icon.className = 'printability-icon '
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



  
document.addEventListener("DOMContentLoaded", function() {
  function populateSearch(event) {
    // Find the closest button element to the clicked element
    const buttonElement = event.target.closest("button");

    // Get the data-filter attribute from the button element
    const filterText = buttonElement.getAttribute("data-filter");

    const searchBar = document.getElementById("searchInput");
    searchBar.value = filterText;  // This line replaces the current text in the search bar
    filterData(filterText);
  }
  
    document.getElementById("heatPressBtn").addEventListener("click", populateSearch);
    document.getElementById("screenPrintBtn").addEventListener("click", populateSearch);
    document.getElementById("decalsBtn").addEventListener("click", populateSearch);
    document.getElementById("embroideryBtn").addEventListener("click", populateSearch);
  
  // Populate SVGs (if you have this function)
  if (typeof populateSVGs === 'function') {
    populateSVGs();
  }
});

// Add search input event listener
docu