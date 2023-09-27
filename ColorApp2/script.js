document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    const logoUpload = document.getElementById('logoUpload');
    const logoCanvas = document.getElementById('logoCanvas');
    const ctx = logoCanvas.getContext('2d');
    
    let pantoneData = [];

    // Fetch Pantone data from JSON
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

const dropArea = document.getElementById('dropArea');
const clickUpload = document.getElementById('clickUpload');

// Handle drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener('drop', handleDrop, false);

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];

    uploadImage(file);
}

clickUpload.addEventListener('click', function () {
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
            logoCanvas.width = img.width;
            logoCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    };

    reader.readAsDataURL(file);
}
    // Color picker
    logoCanvas.addEventListener('mousemove', function (e) {
        const x = e.clientX - logoCanvas.getBoundingClientRect().left;
        const y = e.clientY - logoCanvas.getBoundingClientRect().top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);

        const closestPantone = findClosestPantone(hex);
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

    function rgbToHex(r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16);
    }
});
