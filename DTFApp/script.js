let logos = []; // Array to store logo objects
let dragging = false; // Are we dragging?
let scaling = false; // Are we scaling?
let dragOffset = { x: 0, y: 0 };
let selectedLogo = null; // Currently selected logo

// Function to set canvas size
function setSize(size) {
  currentSize = sizes[size];
  canvas.width = currentSize.width;
  canvas.height = currentSize.height;
  
  if (size === 'xlarge') {
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  } else {
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
  }
  render();
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
 
  logos.push({ img, x: 0, y: 0, width, height: (width * img.height) / img.width });
  render();
}

// Function to render all logos
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  logos.forEach(logo => {
    ctx.drawImage(logo.img, logo.x, logo.y, logo.width, logo.height);
  });
}

// Function to check if a point is inside a logo
function isInsideLogo(x, y, logo) {
  return x > logo.x && x < logo.x + logo.width && y > logo.y && y < logo.y + logo.height;
}

// Mouse down event
canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedLogo = logos.find(logo => isInsideLogo(x, y, logo));

  if (selectedLogo) {
    dragging = true;
    dragOffset = { x: x - selectedLogo.x, y: y - selectedLogo.y };
  }
});

// Mouse move event
canvas.addEventListener('mousemove', function(e) {
  if (dragging && selectedLogo) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedLogo.x = x - dragOffset.x;
    selectedLogo.y = y - dragOffset.y;

    render();
  }
});

// Mouse up event
canvas.addEventListener('mouseup', function(e) {
  dragging = false;
});

// Keyboard events for delete, copy, and paste
document.addEventListener('keydown', function(e) {
  if (selectedLogo) {
    if (e.key === 'Delete') {
      const index = logos.indexOf(selectedLogo);
      if (index > -1) {
        logos.splice(index, 1);
      }
      render();
    } else if (e.key === 'c' && e.ctrlKey) {
      // Ctrl+C to copy
      logos.push({ ...selectedLogo });
      render();
    } else if (e.key === 'v' && e.ctrlKey) {
      // Ctrl+V to paste
      if (selectedLogo) {
        logos.push({ ...selectedLogo, x: selectedLogo.x + 10, y: selectedLogo.y + 10 });
        render();
      }
    }
  }
});

// Function to add logos to sheet


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
