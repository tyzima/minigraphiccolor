const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorsDiv = document.querySelector('.colors');

let lacrosseSVG = new Image();
let uploadedSVG = new Image();

// Sample color options, you can expand this list
const colors = ['#c10230', '#85152B', '#7a303f', '#8a2432']; // ... add more colors based on your list

// Populate color options
colors.forEach(color => {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.addEventListener('click', () => changeColor(color));
    colorsDiv.appendChild(div);
});

function changeColor(color) {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    const svgXML = parser.parseFromString(lacrosseSVG.outerHTML, 'image/svg+xml');
    const paths = svgXML.querySelectorAll('path');

    paths.forEach(path => {
        path.setAttribute('fill', color);
    });

    const newSVGString = serializer.serializeToString(svgXML.documentElement);
    lacrosseSVG.src = 'data:image/svg+xml,' + encodeURIComponent(newSVGString);

    // Redraw the canvas with the updated color
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedSVG, 0, 0);
    ctx.drawImage(lacrosseSVG, 0, uploadedSVG.height);
}

// Functionality to update the "LACROSSE" SVG when font type is changed
document.getElementById('fontSelect').addEventListener('change', function(event) {
    const fontType = event.target.value;
    lacrosseSVG.src = `path_to_svgs/${fontType}.svg`; // Assuming you have different SVGs for each font type
});

// Draw the uploaded SVG
document.getElementById('svgInput').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedSVG.src = e.target.result;
        uploadedSVG.onload = () => {
            ctx.drawImage(uploadedSVG, 0, 0);
            ctx.drawImage(lacrosseSVG, 0, uploadedSVG.height); // Drawing "LACROSSE" below the uploaded SVG
        }
    }
    reader.readAsDataURL(event.target.files[0]);
});

// Download composite SVG functionality
document.getElementById('downloadBtn').addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/svg+xml');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'composite.svg';
    a.click();
});
