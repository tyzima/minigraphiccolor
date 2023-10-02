// Fetching both JSON files
Promise.all([
    fetch('logos.json').then(res => res.json()),
    fetch('colors.json').then(res => res.json())
  ]).then(([logoData, colorData]) => {
    const logoGrid = document.getElementById('logoGrid');
    const searchTeamName = document.getElementById('searchTeamName');
    const searchDescription = document.getElementById('searchDescription');
    const searchLogoID = document.getElementById('searchLogoID');
    const changeBgColorBtn = document.getElementById('changeBgColor');
    
    let currentPage = 1;
    const recordsPerPage = 10;
  
    // Function to create logo cards
    const createLogoCards = (logos, page = 1) => {
      // Clear the grid first
      logoGrid.innerHTML = '';
  
      // Calculate starting and end records
      const start = (page - 1) * recordsPerPage;
      const end = start + recordsPerPage;
  
      // Paginate data
      const paginatedLogos = logos.slice(start, end);
  
      paginatedLogos.forEach(logo => {
        const logoCard = document.createElement('div');
        logoCard.className = 'logo-card';
        
        const logoIDCircle = document.createElement('div');
        logoIDCircle.innerText = logo['Logo ID'];
        logoIDCircle.className = 'logo-id-circle';
        
        const logoImage = document.createElement('img');
        logoImage.src = logo['PNG'];
        logoImage.className = 'logo-image';
        
        const description = document.createElement('div');
        description.innerText = logo['Description'].toUpperCase();
        description.className = 'logo-description';
        
        const teamName = document.createElement('div');
        teamName.innerText = logo['Account Name'];
        teamName.className = 'team-name';
        
        const editColorsBtn = document.createElement('button');
        editColorsBtn.innerText = 'Edit Colors';
        editColorsBtn.onclick = () => window.open(logo['LaxInkEditor'], '_blank');
        
        const colorHelper = document.createElement('div');
        colorHelper.className = 'color-helper';
        
        // Populate color swatches using colorData
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch';
        colorSwatch.style.backgroundColor = colorData[logo['ColorHelper'].substring(1)]['HexCode'];
        colorHelper.appendChild(colorSwatch);
  
        logoCard.appendChild(logoIDCircle);
        logoCard.appendChild(logoImage);
        logoCard.appendChild(description);
        logoCard.appendChild(teamName);
        logoCard.appendChild(editColorsBtn);
        logoCard.appendChild(colorHelper);
        
        logoGrid.appendChild(logoCard);
      });
    };
  
    // Initialize with all logos
    createLogoCards(logoData, currentPage);
  
    // Add search functionality by Team Name
    searchTeamName.addEventListener('input', function() {
      const filteredLogos = logoData.filter(logo => 
        logo['Account Name'].toLowerCase().includes(this.value.toLowerCase())
      );
      createLogoCards(filteredLogos, currentPage);
    });
  
    // Add search functionality by Description
    searchDescription.addEventListener('input', function() {
      const filteredLogos = logoData.filter(logo => 
        logo['Description'].toLowerCase().includes(this.value.toLowerCase())
      );
      createLogoCards(filteredLogos, currentPage);
    });
  
    // Add search functionality by Logo ID
    searchLogoID.addEventListener('input', function() {
      const filteredLogos = logoData.filter(logo => 
        logo['Logo ID'].toString().includes(this.value)
      );
      createLogoCards(filteredLogos, currentPage);
    });
  
    // Change background color
    const colorOptions = [
      "#c10230", "#85152B", "#7a303f", "#8a2432", "#c2502e", "#f13200",
      "#fde021", "#ffb71b", "#d0b787", "#124734", "#93d500", "#007934",
      "#85DFFF", "#79a3dc", "#6aaae4", "#004a98", "#002DAD", "#003595",
      "#12284c", "#532e7d", "#222223", "#9ea1a2", "#85714D", "#a2a9ad",
      "#333F48", "#373a36", "#6E6259", "#F1E6B2", "#4c372b", "#F99FC9",
      "#E31C79", "#cc5599", "#e3e829", "#005d70"
    ];
    
    changeBgColorBtn.addEventListener('click', function() {
      const randomIndex = Math.floor(Math.random() * colorOptions.length);
      document.body.style.backgroundColor = colorOptions[randomIndex];
    });
  });
  