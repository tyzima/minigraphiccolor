// Define canvas and context
const canvas = document.getElementById("logoCanvas");
const ctx = canvas.getContext("2d");

// Define sizes
const sizes = {
  small: { width: 11 * 20, height: 12.5 * 20 },
  medium: { width: 22.5 * 20, height: 12.5 * 20 },
  large: { width: 22.5 * 20, height: 25 * 20 },
  xlarge: { width: 22.5 * 20, height: 60 * 20 },
};

// Set initial size
let currentSize = sizes.small;
setSize("small");

// Function to set canvas size
function setSize(size) {
  currentSize = sizes[size];
  canvas.width = currentSize.width;
  canvas.height = currentSize.height;
}

// Function to add logos to sheet
async function addToSheet() {
  const logoID = document.getElementById("logoID").value;
  const qty = parseInt(document.getElementById("qty").value);
  const width = parseInt(document.getElementById("width").value);
  
  // Assuming the image is hosted publicly
  const imgUrl = `https://res.cloudinary.com/laxdotcom/image/upload/v1663810522/0012I00002myQeQ/SVG.0012I00002myQeQ.${logoID}.svg`;
  
  const img = new Image();
  img.crossOrigin = "anonymous";  // This line is important to avoid security issues
  
  img.onload = function() {
    let x = 0, y = 0;
    for (let i = 0; i < qty; i++) {
      ctx.drawImage(img, x, y, width, (width * img.height) / img.width);
      
      x += width + 5; // 5 units for spacing
      if (x + width > canvas.width) {
        x = 0;
        y += (width * img.height) / img.width + 5;
      }
    }
  };
  
  img.src = imgUrl;
}

// Function to download as PDF
function downloadPDF() {
  const pdf = new jsPDF();
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
  pdf.save("logos.pdf");
}

// Function to download as PNG
function downloadPNG() {
  const link = document.createElement('a');
  link.download = 'logos.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
