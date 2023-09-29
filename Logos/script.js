// Initialize Airtable API

async function fetchData() {
  try {
    const response = await fetch("/.netlify/functions/fetchtoAirtable");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

// Populate dropdown and logo container
async function populateUI() {
  const records = await fetchData();
  const teamDropdown = document.getElementById("teamDropdown");
  const logoContainer = document.getElementById("logoContainer");

  // Populate team dropdown
  const teams = [...new Set(records.map(record => record.fields['fldcDjjDsx2BVln9i']))];
  teams.forEach(team => {
    const option = document.createElement("option");
    option.value = team;
    option.textContent = team;
    teamDropdown.appendChild(option);
  });

  // Function to display logos
  const displayLogos = (team, description) => {
    logoContainer.innerHTML = '';
    const filteredRecords = records.filter(record => {
      return record.fields['fldcDjjDsx2BVln9i'] === team &&
             (!description || record.fields['fldywsHjKLmxjPX5B'].includes(description));
    });

    // Sort by number of colors in the logo
    filteredRecords.sort((a, b) => {
      const colorsA = a.fields['fldANUG8ty2USLyi6'].split(',').length;
      const colorsB = b.fields['fldANUG8ty2USLyi6'].split(',').length;
      return colorsA - colorsB;
    });

    // Create cards
    filteredRecords.forEach(record => {
      const card = document.createElement("div");
      card.className = "card";
      const imgSrc = `https://res.cloudinary.com/laxdotcom/image/upload/b_none/${record.fields['fldRlZ94aFnTmuoMk']}/${record.fields['fldRlZ94aFnTmuoMk']}.${record.fields['fldrCkeyF3sLFOxOu']}.png`;
      card.innerHTML = `<img src="${imgSrc}" alt="${record.fields['fldywsHjKLmxjPX5B']}">`;
      logoContainer.appendChild(card);
    });
  };

  // Event listeners for dropdown and text input
  teamDropdown.addEventListener("change", () => {
    const team = teamDropdown.value;
    const description = document.getElementById("descriptionSearch").value;
    displayLogos(team, description);
  });

  document.getElementById("descriptionSearch").addEventListener("input", () => {
    const team = teamDropdown.value;
    const description = document.getElementById("descriptionSearch").value;
    displayLogos(team, description);
  });

  // Initialize UI with the first team
  if (teams.length > 0) {
    displayLogos(teams[0]);
  }
}

// Initialize UI
populateUI();
