// Initialize an empty array to store the Pantone colors
let pantoneColors = [];

// Fetch the Pantone colors from the root directory JSON file
fetch('/pantone_CMYK_RGB_Hex.json')
  .then(response => response.json())
  .then(data => {
    pantoneColors = data;
  });

document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('logoInput');
  const colorResults = document.getElementById('colorResults');
  const imageBox = document.getElementById('imageBox');
  const colorThief = new ColorThief();

  inputElement.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = reader.result;
        img.onload = function() {
          // Display the image
          imageBox.innerHTML = `<img src="${img.src}" style="width: 100px; height: 100px; border-radius: 12px;"/>`;
          
          // Extract the palette of colors
          const palette = colorThief.getPalette(img, 5);
          displayColors(palette);
        };
      };
    }
  });
});

function displayColors(palette) {
  const colorList = palette.map(color => {
    const [r, g, b] = color;
    const hex = rgbToHex(r, g, b);
    const closestPantone = findSimilarPantone(color);
    return `<div style="background-color: ${hex}; width: 50px; height: 50px; border-radius: 50%; margin: 5px; display: inline-block;">
              <span style="font-size: 10px">${closestPantone}</span>
            </div>`;
  }).join('');

  colorResults.innerHTML = colorList;
}

function rgbToHex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + ("000000" + hex).slice(-6);
}

// Function to find the most similar PANTONE color
function findSimilarPantone(rgb) {
  let minDistance = Number.MAX_VALUE;
  let closestPantone;

  pantoneColors.forEach(pantone => {
    const distance = colorDistance(rgb, [parseInt(pantone.R), parseInt(pantone.G), parseInt(pantone.B)]);
    if (distance < minDistance) {
      minDistance = distance;
      closestPantone = pantone;
    }
  });

  return closestPantone ? closestPantone.Code : "N/A";
}

// Function to calculate Euclidean distance between two colors
function colorDistance(color1, color2) {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;

  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}
