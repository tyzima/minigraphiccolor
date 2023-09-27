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


