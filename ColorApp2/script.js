document.addEventListener('DOMContentLoaded', function() {
    const colorThief = new ColorThief();
    const logoUpload = document.getElementById('logoUpload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const matchedColorsDiv = document.getElementById('matchedColors');

    const colorSpectrum = {
        "White": "#FFFFFF",
        "Scarlet Red": "#c10230",
        // ... (add all your other colors here)
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
