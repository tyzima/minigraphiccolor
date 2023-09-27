document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    const logoUpload = document.getElementById('logoUpload');
    const logoCanvas = document.getElementById('logoCanvas');
    const dropArea = document.getElementById('dropArea');
    const ctx = logoCanvas.getContext('2d');
    
    let pantoneData = [];
    // Initialize with sample company colors; replace with your actual colors
    const companyColors = [
        {name: 'White', hex: '#FFFFFF'},
        // ... add your other colors here
    ];

    // Fetch Pantone data from JSON
    fetch('./pantone_CMYK_RGB_Hex.json')
        .then(response => response.json())
        .then(data => {
            pantoneData = data;
        });

    searchBtn.addEventListener('click', function () {
        const hexInput = document.getElementById('hexInput').value;
        const closestPantone = findClosestPantone(hexInput);
        const closestCompanyColor = findClosestCompanyColor(hexInput);
        displayResult(closestPantone, closestCompanyColor);
    });

    // Handling drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        const file = files[0];
        const imageType = /^image\//;

        if (!imageType.test(file.type)) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                ctx.drawImage(img, 0, 0, logoCanvas.width, logoCanvas.height);
            };
        };
        reader.readAsDataURL(file);
    }

    // Color picker logic
    logoCanvas.addEventListener('mousemove', function (e) {
        const x = e.clientX - logoCanvas.getBoundingClientRect().left;
        const y = e.clientY - logoCanvas.getBoundingClientRect().top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
        
        const closestPantone = findClosestPantone(hex);
        const closestCompanyColor = findClosestCompanyColor(hex);
        displayResult(closestPantone, closestCompanyColor);
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

    function displayResult(pantone, closestCompanyColor) {
        const imgSrc = `https://www.pantone.com/media/wysiwyg/color-finder/img/pantone-color-chip-${pantone.Code.replace(' ', '-').toLowerCase()}-c.webp`;
        resultDiv.innerHTML = `
            <h2>Closest Pantone Color</h2>
            <div>
                <img src="${imgSrc}" alt="${pantone.Code}" style="width: 80px;">
                <div class="company-color-label" style="background-color: ${closestCompanyColor.hex};">
                    Closest Company Color: ${closestCompanyColor.name}
                </div>
            </div>
        `;
    }

    // Helper functions (color conversion and distance calculation)
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

    function rgbToHex(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    }
});
