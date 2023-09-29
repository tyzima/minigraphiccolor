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
