document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const convertBtn = document.getElementById("convertBtn");
    const downloadLinks = document.getElementById("downloadLinks");
  
    let video = document.createElement("video");
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
  
    convertBtn.addEventListener("click", () => {
      const file = fileInput.files[0];
      if (file && file.type === "video/mp4") {
        const objectURL = URL.createObjectURL(file);
        video.src = objectURL;
  
        video.addEventListener("loadeddata", () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
  
          let frameCount = 0;
          video.currentTime = 0;
  
          video.addEventListener("seeked", () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `frame_${frameCount}.png`;
              link.innerHTML = `Download Frame ${frameCount}`;
              downloadLinks.appendChild(link);
              downloadLinks.appendChild(document.createElement("br"));
  
              frameCount++;
              if (frameCount < 10) { // Limiting to 10 frames for demonstration
                video.currentTime += 0.5; // Capture every 0.5 seconds
              }
            }, "image/png");
          });
  
          video.currentTime += 0.5;
        });
      }
    });
  });
  