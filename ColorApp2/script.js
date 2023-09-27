document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    let pantoneData = [];

    // Fetch Pantone data from the JSON file
    fetch('./pantone_CMYK_RGB_Hex.json')
        .then(response => response.json())
        .then(data => {
            pantoneData = data;
        });

    searchBtn.addEventListener('click', function () {
        const hexInput = document.getElementById('hexInput').value;
        const closestPantone = findClosestPantone(hexInput);
        displayResult(closestPantone);
    });

    function findClosestPantone(hex) {
        let closestDistance = Infinity;
        let closestPantone = null;

        for (const color of pantoneData) {
            const distance = colorDistance(hexToRgb(hex), hexToRgb(color.Hex));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPantone = color;
            }
        }
        return closestPantone;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    function colorDistance(color1, color2) {
        return Math.sqrt(
            Math.pow((color1.r - color2.r), 2) +
            Math.pow((color1.g - color2.g), 2) +
            Math.pow((color1.b - color2.b), 2)
        );
    }

    function displayResult(pantone) {
        const imgSrc = `https://www.pantone.com/media/wysiwyg/color-finder/img/pantone-color-chip-${pantone.Code.replace(' ', '-').toLowerCase()}-c.webp`;
        resultDiv.innerHTML = `
            <h2>Closest Pantone Color</h2>
            <div>
                <img src="${imgSrc}" alt="${pantone.Code}">
                <p><strong>Code:</strong> ${pantone.Code}</p>
                <p><strong>HEX:</strong> ${pantone.Hex}</p>
                <p><strong>RGB:</strong> (${pantone.R}, ${pantone.G}, ${pantone.B})</p>
                <p><strong>CMYK:</strong> C${pantone.C} M${pantone.M} Y${pantone.Y} K${pantone.K}</p>
            </div>
        `;
    }
});

document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Draw the image on a canvas and analyze it
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Get dominant colors (this can be optimized for performance)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colors = [];
                for (let i = 0; i < imageData.length; i += 4) {
                    const colorHex = rgbToHex(imageData[i], imageData[i + 1], imageData[i + 2]);
                    colors.push(colorHex);
                }

                // Find unique colors and their closest Pantone colors
                const uniqueColors = Array.from(new Set(colors));
                uniqueColors.forEach(color => {
                    const closestPantone = findClosestPantone(color);
                    displayResult(closestPantone);
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

