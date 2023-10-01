document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.getElementById('imageInput');
    const colorInput = document.getElementById('colorInput');
    const vectorizeButton = document.getElementById('vectorizeButton');
    const imagePreview = document.getElementById('imagePreview');
    const svgPreview = document.getElementById('svgPreview');

    let selectedFile;

    // Handle file selection
    imageInput.addEventListener('change', function(event) {
        selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Selected Image" width="200" height="200">`;
        };
        reader.readAsDataURL(selectedFile);
    });

    // Handle vectorization
    vectorizeButton.addEventListener('click', function() {
        if (!selectedFile) {
            alert('Please select an image first.');
            return;
        }

        const numberOfColors = colorInput.value || 0;
// Handle vectorization
vectorizeButton.addEventListener('click', async function() {
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }
  
    const numberOfColors = colorInput.value || 0;
  
    // Convert the selected file to a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async function() {
      const base64data = reader.result.split(',')[1];
      
      // Send data to the serverless function
      try {
        const response = await fetch('/.netlify/functions/vectorize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64data,
            max_colors: numberOfColors
          }),
        });
  
        const data = await response.json();
  
        // Display the vectorized SVG in svgPreview
        svgPreview.innerHTML = data.svg;
      } catch (error) {
        console.error('Error vectorizing image:', error);
        alert('Failed to vectorize image');
      }
    };
  });
    });
});
