// script.js

const canvas = new fabric.Canvas('canvas');

function changeCanvasSize(size) {
  let width, height;
  switch(size) {
    case 'small':
      width = 11 * 10; // 10 pixels per inch
      height = 12.5 * 10;
      break;
    case 'medium':
      width = 22.5 * 10;
      height = 12.5 * 10;
      break;
    case 'large':
      width = 22.5 * 10;
      height = 25 * 10;
      break;
    case 'xlarge':
      width = 22.5 * 10;
      height = 60 * 10;
      break;
  }
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.renderAll();
}
let xPosition = 10; // Initial X position
let yPosition = 10; // Initial Y position

function addToSheet() {
  const logoID = document.getElementById('logoID').value;
  const qty = parseInt(document.getElementById('qty').value, 10);
  const width = parseFloat(document.getElementById('width').value);

  for (let i = 0; i < qty; i++) {
    fabric.loadSVGFromURL(`https://res.cloudinary.com/laxdotcom/image/upload/logos/${logoID}.svg`, function(objects, options) {
      const logo = fabric.util.groupSVGElements(objects, options);
      logo.set({
        left: xPosition,
        top: yPosition,
        scaleX: width / logo.width,
        scaleY: width / logo.width
      });
      
      // Increment positions
      xPosition += width + 2.5; // 0.25" spacing between each logo in pixels
      
      // Check if next logo would go out of canvas, then move to the next row
      if (xPosition + width > canvas.width) {
        xPosition = 10;
        yPosition += width + 2.5; // 0.25" spacing between rows in pixels
      }

      canvas.add(logo);
      canvas.renderAll();
    });
  }
}
function downloadPDF() {
    const pdf = new jsPDF('l', 'mm', [canvas.width * 0.264583, canvas.height * 0.264583]);
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
    pdf.save('canvas.pdf');
  }
  
  function downloadPNG() {
    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 4 // 400 dpi / 96 dpi (default)
    });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'canvas.png';
    a.click();
  }
  