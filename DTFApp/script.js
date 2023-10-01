const canvas = document.getElementById("logoCanvas");
const ctx = canvas.getContext("2d");

let logos = [];
let dragging = false;
let scaling = false;
let dragOffset = { x: 0, y: 0 };
let selectedLogo = null;
let resizing = false;
let tooltip = null;

const sizes = {
  small: { width: 11 * 20, height: 12.5 * 20 },
  medium: { width: 22.5 * 20, height: 12.5 * 20 },
  large: { width: 22.5 * 20, height: 25 * 20 },
  xlarge: { width: 22.5 * 20, height: 60 * 20 }
};

setSize('small');
initTooltip();

function setSize(size) {
  const newSize = sizes[size];
  canvas.width = newSize.width;
  canvas.height = newSize.height;
  if (size === 'xlarge') {
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  } else {
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
  }
  render();
}

function initTooltip() {
    tooltip = document.getElementById("tooltip");
  tooltip.style.position = 'fixed';
  tooltip.style.backgroundColor = '#333';
  tooltip.style.color = 'white';
  tooltip.style.padding = '5px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);
}


async function addToSheet() {
    const logoID = document.getElementById("logoID").value;
    const qty = parseInt(document.getElementById("qty").value);
    const widthRatio = parseInt(document.getElementById("width").value) / canvas.width;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://res.cloudinary.com/laxdotcom/image/upload/Logos/${logoID}.svg`;
    await img.decode();
    
    for (let i = 0; i < qty; i++) {
      const width = canvas.width * widthRatio;
      const height = (width * img.height) / img.width;
      const logo = { img, x: 0, y: 0, width, height };
      logos.push(logo);
    }
    render();
  }
  

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  logos.forEach(logo => {
    ctx.drawImage(logo.img, logo.x, logo.y, logo.width, logo.height);
  });
}

function isInsideLogo(x, y, logo) {
  return x > logo.x && x < logo.x + logo.width && y > logo.y && y < logo.y + logo.height;
}

canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedLogo = logos.find(logo => isInsideLogo(x, y, logo));

  if (selectedLogo) {
    dragging = true;
    dragOffset = { x: x - selectedLogo.x, y: y - selectedLogo.y };
    
    if (Math.abs(x - (selectedLogo.x + selectedLogo.width)) < 10 && 
        Math.abs(y - (selectedLogo.y + selectedLogo.height)) < 10) {
      resizing = true;
    }
  }
});

canvas.addEventListener('mousemove', function(e) {
  if (dragging && selectedLogo) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedLogo.x = x - dragOffset.x;
    selectedLogo.y = y - dragOffset.y;

    render();
  }
  
  if (resizing && selectedLogo) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    selectedLogo.width = x - selectedLogo.x;
    selectedLogo.height = y - selectedLogo.y;

    // Update tooltip
    tooltip.textContent = `Width: ${selectedLogo.width.toFixed(2)}, Height: ${selectedLogo.height.toFixed(2)}`;
    render();
  }
});

canvas.addEventListener('mouseup', function(e) {
  dragging = false;
  resizing = false;
  if (tooltip) {
    tooltip.style.display = 'none';
  }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete') {
      const index = logos.indexOf(selectedLogo);
      if (index > -1) {
        logos.splice(index, 1);
      }
      render();
    } else if (e.ctrlKey && e.key === 'c') {
      logos.push({ ...selectedLogo });
      render();
    } else if (e.ctrlKey && e.key === 'v') {
      logos.push({ ...selectedLogo, x: selectedLogo.x + 10, y: selectedLogo.y + 10 });
      render();
    }
  });
  

function downloadPNG() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width * 4; // 4x for higher resolution
    tempCanvas.height = canvas.height * 4;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.scale(4, 4);
    logos.forEach(logo => {
      tempCtx.drawImage(logo.img, logo.x, logo.y, logo.width, logo.height);
    });
  
    const link = document.createElement('a');
    link.download = 'logos.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }