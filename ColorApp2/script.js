document.addEventListener('DOMContentLoaded', function() {
  const inputElement = document.getElementById('logoInput');
  const colorResults = document.getElementById('colorResults');
  const colorThief = new ColorThief();

  inputElement.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // To handle CORS
        img.src = reader.result;
        img.onload = function() {
          document.getElementById('imageBox').innerHTML = `<img src="${img.src}" style="width: 100px; height: 100px; border-radius: 12px;"/>`;
          const palette = colorThief.getPalette(img, 5);
          displayColors(palette);
        };
      };
    }
  });
});

function displayColors(palette) {
  const colorList = palette.map(color => {
    const [r, g, b] = color;
    const hex = rgbToHex(r, g, b);
    return `<div style="background-color: ${hex}; width: 50px; height: 50px; border-radius: 50%; margin: 5px; display: inline-block;"></div>`;
  }).join('');

  colorResults.innerHTML = colorList;
}

function rgbToHex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + ("000000" + hex).slice(-6);
}
