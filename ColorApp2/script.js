document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('logoInput');
  const colorResults = document.getElementById('colorResults');

  inputElement.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        // Create a Fabric Image object
        fabric.Image.fromURL(reader.result, function(img) {
          const canvas = new fabric.Canvas();
          canvas.add(img);
          // Analyze the image and get dominant colors
          const dominantColors = getDominantColors(canvas, img);
          displayColors(dominantColors);
        });
      };
    }
  });
});

function getDominantColors(canvas, img) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;
  const colorCount = {};

  for(let i = 0; i < data.length; i += 4) {
    const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    colorCount[rgb] = (colorCount[rgb] || 0) + 1;
  }

  const dominantColors = Object.keys(colorCount)
    .sort((a, b) => colorCount[b] - colorCount[a])
    .slice(0, 5)
    .map(rgb => {
      const [r, g, b] = rgb.split(',');
      return rgbToHex(Number(r), Number(g), Number(b));
    });

  return dominantColors;
}

function rgbToHex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + ("000000" + hex).slice(-6);
}

function displayColors(colors) {
  const colorList = colors.map(color => `<div style="width: 50px; height: 50px; background-color: ${color};"></div>`).join('');
  document.getElementById('colorResults').innerHTML = colorList;
}
