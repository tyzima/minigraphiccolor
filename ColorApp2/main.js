document.addEventListener('DOMContentLoaded', function() {
    const colorThief = new ColorThief();
    const logoUpload = document.getElementById('logoUpload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const matchedColorsDiv = document.getElementById('matchedColors');

const colorSpectrum = {
    "White": "#FFFFFF",
    "Scarlet Red": "#c10230",
    "Burgundy": "#85152B",
    "Nike Burgundy": "#7a303f",
    "Nike Crimson": "#8a2432",
    "Cascade Orange": "#c2502e",
    "Nike Orange": "#f13200",
    "Texas Orange": "#d15e14",
    "Yellow": "#fde021",
    "Athletic Gold": "#ffb71b",
    "Vegas Khaki": "#d0b787",
    "Forest Green": "#124734",
    "True Green": "#93d500",
    "Kelly Green": "#007934",
    "Cascade Carolina": "#85DFFF",
    "Carolina Nike": "#79a3dc",
    "Hopkins Blue": "#6aaae4",
    "Royal Blue": "#004a98",
    "Cobalt": "#002DAD",
    "Nike Cobalt": "#003595",
    "Nike Navy": "#12284c",
    "Purple": "#532e7d",
    "Black": "#222223",
    "Shimmer Black": "#000000", // Placeholder, replace with actual HEX
    "Metallic Silver": "#9ea1a2",
    "Metallic Gold": "#85714D",
    "Grey": "#a2a9ad",
    "Dark Grey": "#333F48",
    "Nike Anthracite": "#373a36",
    "Pewter": "#6E6259",
    "Cream": "#F1E6B2",
    "Brown": "#4c372b",
    "Light Pink": "#F99FC9",
    "Dark Pink": "#E31C79",
    "Pink": "#cc5599",
    "Volt": "#e3e829",
    "Teal": "#005d70",
    "Mint": "#8CE2D0"
};


    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const dominantColor = colorThief.getColor(canvas);
            const dominantHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
            const closestColor = findClosestColor(dominantHex);
            matchedColorsDiv.innerHTML = `<div style="background-color: ${closestColor}; padding: 20px;">${closestColor}</div>`;
        };
    });

    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    function findClosestColor(hex) {
        let closestColor = null;
        let closestDistance = Infinity;

        for (const [name, color] of Object.entries(colorSpectrum)) {
            const distance = colorDistance(hex, color);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestColor = name;
            }
        }

        return closestColor;
    }

    function colorDistance(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);

        const dr = rgb1.r - rgb2.r;
        const dg = rgb1.g - rgb2.g;
        const db = rgb1.b - rgb2.b;

        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
});
