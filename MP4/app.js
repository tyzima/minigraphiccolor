document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const downloadLinks = document.getElementById("downloadLinks");

  let video = document.createElement("video");
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let zip = new JSZip();

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

        video.addEventListener("seeked", async () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
          zip.file(`frame_${frameCount}.png`, blob, { binary: true });

          frameCount++;
          if (frameCount < 10) { // Limiting to 10 frames for demonstration
            video.currentTime += 0.5; // Capture every 0.5 seconds
          } else {
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = "frames.zip";
            link.innerHTML = "Download All Frames as ZIP";
            downloadLinks.appendChild(link);
          }
        });

        video.currentTime += 0.5;
      });
    }
  });
});
