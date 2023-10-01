function showLightbox(id) {
  const lightbox = document.getElementById(id);
  lightbox.style.display = 'block';
  setTimeout(() => {
    lightbox.classList.add('show');
  }, 10);
}

function hideLightbox(id) {
  const lightbox = document.getElementById(id);
  lightbox.classList.remove('show');
  setTimeout(() => {
    lightbox.style.display = 'none';
  }, 300);
}


// Add this code to close Lightbox when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const lightboxes = document.querySelectorAll('.lightbox');
  lightboxes.forEach((lightbox) => {
    lightbox.addEventListener('click', function(event) {
      if (event.target === lightbox) { // Check if click is outside of content
        hideLightbox(lightbox.id);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const teamCustom = document.getElementById("team-custom");
  const text = teamCustom.textContent || teamCustom.innerText;
  teamCustom.setAttribute("data-text", text);
});
