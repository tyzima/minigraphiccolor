const canvas = document.getElementById("logoCanvas");
const ctx = canvas.getContext("2d");

// Initialize variables
let logos = [];
let dragging = false;
let scaling = false;
let dragOffset = { x: 0, y: 0 };
let selectedLogo = null;

const sizes = {
  small: { width: 11 * 20, height: 12.5 * 20 },
  medium: { width: 22.5 * 20, height: 12.5 * 20 },
  large: { width: 22.5 * 20, height: 25 * 20 },
  xlarge: { width: 22.5 * 20, height: 60 * 20 },
};

// Set the initial canvas size
setSize('small');

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

async function addToSheet() {
  const logoID = document.getElementById("logoID").value;
  const qty = parseInt(document.getElementById("qty").value);
  const width = parseInt(document.getElementById("width").value);

  const imgUrl = `https://res.cloudinary.com/laxdotcom/image/upload/logos/${logoID}.svg`;

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = function() {
    for (let i = 0; i < qty; i++) {
      const logo = {
        img: img,
        x: 0,
        y: 0,
        width: width,
        height: (width * img.height) / img.width
      };
      logos.push(logo);
    }
    render();
  };

  img.src = imgUrl;
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
});

canvas.addEventListener('mouseup', function(e) {
  dragging = false;
});

document.addEventListener('keydown', function(e) {
  if (selectedLogo) {
    if (e.key === 'Delete') {
      const index = logos.indexOf(selectedLogo);
      if (index > -1) {
        logos.splice(index, 1);
      }
      render();
    } else if (e.key === 'c' && e.ctrlKey) {
      logos.push({ ...selectedLogo });
      render();
    } else if (e.key === 'v' && e.ctrlKey) {
      logos.push({ ...selectedLogo, x: selectedLogo.x + 10, y: selectedLogo.y + 10 });
      render();
    }
  }
});

function downloadPDF() {
  // We'll tackle this part later
}

function downloadPNG() {
  // We'll tackle this part later
}
