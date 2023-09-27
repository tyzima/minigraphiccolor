document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    const logoCanvas = document.getElementById('logoCanvas');
    const logoUpload = document.getElementById('logoUpload');
    const ctx = logoCanvas.getContext('2d');
    
    let pantoneData = [];

    // Your company colors
    const companyColors = [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Scarlet Red', hex: '#c10230' },
        // ... add all your other colors here
        { name: 'Mint', hex: '#8CE2D0' }
    ];

    // Fetch Pantone data from JSON
    fetch('./pantone_CMYK_RGB_Hex.json')
        .then(response => response.json())
        .then(data => {
            pantoneData = data;
        });

    // Manual color search
    searchBtn.addEventListener('click', function () {
        const hexInput = document.getElementById('hexInput').value;
        const closestPantone = findClosestPantone(hexInput);
        const closestCompanyColor = findClosestCompanyColor(hexInput);
        displayResult(closestPantone, closestCompanyColor);
    });

    // Drag-and-drop and click-to-upload functionalities
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        logoCanvas.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    logoCanvas.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        uploadImage(file);
    }

    logoCanvas.addEventListener('click', function () {
        logoUpload.click();
    });

    logoUpload.addEventListener('change', function () {
        uploadImage(this.files[0]);
    });

    function uploadImage(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const scale = Math.min(250 / img.width, 250 / img.height);
                logoCanvas.width = img.width * scale;
                logoCanvas.height = img.height * scale;
                ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
                ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
            };
        };

        reader.readAsDataURL(file);
    }

    // Color picker functionality
    logoCanvas.addEventListener('mousemove', function (e) {
        const x = e.clientX - logoCanvas.getBoundingClientRect().left;
        const y = e.clientY - logoCanvas.getBoundingClientRect().top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
        
        const closestPantone = findClosestPantone(hex);
        const closestCompanyColor = findClosestCompanyColor(hex);
        displayResult(closestPantone, closestCompanyColor);
    });

    // ... (Your existing functions for finding closest Pantone, converting HEX to RGB, etc.)

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

    function findClosestCompanyColor(hex) {
        let closestDistance = Infinity;
        let closestCompanyColor = null;

        for (const color of companyColors) {
            const distance = colorDistance(hexToRgb(hex), hexToRgb(color.hex));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCompanyColor = color;
            }
        }
        return closestCompanyColor;
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

    function displayResult(pantone, closestCompanyColor) {
        const imgSrc = `https://www.pantone.com/media/wysiwyg/color-finder/img/pantone-color-chip-${pantone.Code.replace(' ', '-').toLowerCase()}-c.webp`;
        resultDiv.innerHTML = `
            <h2>Closest Pantone Color</h2>
            <div>
                <img src="${imgSrc}" alt="${pantone.Code}" style="width: 80px;">
                <div class="company-color-label" style="background-color: ${closestCompanyColor.hex};">
                    Closest Company Color: ${closestCompanyColor.name}
                </div>
                <!-- ... rest of your existing code ... -->
            </div>
        `;
    }

    function rgbToHex(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    }
});
