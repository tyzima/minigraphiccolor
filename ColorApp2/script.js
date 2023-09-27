document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    const logoCanvas = document.getElementById('logoCanvas');
    const logoUpload = document.getElementById('logoUpload');
    const dropArea = document.getElementById('dropArea');
    const ctx = logoCanvas.getContext('2d');
    
    let pantoneData = [];

    // Company colors
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

    // Drag and drop for the drop area
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
        const file = dt.files[0];
        uploadImage(file);
    }

    logoUpload.addEventListener('change', function () {
        uploadImage(this.files[0]);
    });

    function uploadImage(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                logoCanvas.width = 400; // Adjusted dimensions
                logoCanvas.height = 400; // Adjusted dimensions
                ctx.drawImage(img, 0, 0, 400, 400); // Adjusted dimensions
            };
        };

        reader.readAsDataURL(file);
    }
// ... (previous parts of the code remain the same)

// Color picker
logoCanvas.addEventListener('mousemove', function (e) {
    const x = e.clientX - logoCanvas.getBoundingClientRect().left;
    const y = e.clientY - logoCanvas.getBoundingClientRect().top;
    
    // Make sure to scale the coordinates relative to the original image dimensions
    const scaledX = Math.floor(x * (logoCanvas.width / logoCanvas.clientWidth));
    const scaledY = Math.floor(y * (logoCanvas.height / logoCanvas.clientHeight));
    
    const pixel = ctx.getImageData(scaledX, scaledY, 1, 1).data;
    const hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);

    const closestPantone = findClosestPantone(hex);
    const closestCompanyColor = findClosestCompanyColor(hex);
    displayResult(closestPantone, closestCompanyColor);
});

// ... (rest of the code remains the same, including findClosestPantone, findClosestCompanyColor, and displayResult functions)


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

    // ... (rest of the code remains the same, including hexToRgb, colorDistance, and rgbToHex functions)

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
});

