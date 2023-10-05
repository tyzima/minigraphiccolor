document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const convertBtn = document.getElementById("convertBtn");
  const downloadLinks = document.getElementById("downloadLinks");

  let video = document.createElement("video");
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let zip = new JSZip();

  function sobelEdgeDetection(imageData) {
    const sobelData = Sobel(imageData);
    const edgeData = sobelData.toImageData();
    return edgeData;
  }

  function Sobel(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint32Array(imageData.data.buffer);
    const output = new Uint32Array(width * height);
    const sobelKernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelKernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let px = (y * width + x) << 2; // pixel index
        let gx = 0;
        let gy = 0;

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            let weightX = sobelKernelX[(j + 1) * 3 + (i + 1)];
            let weightY = sobelKernelY[(j + 1) * 3 + (i + 1)];
            let neighborPx = ((y + j) * width + (x + i)) << 2;

            let r = imageData.data[neighborPx];
            let g = imageData.data[neighborPx + 1];
            let b = imageData.data[neighborPx + 2];

            let avg = (r + g + b) / 3;

            gx += avg * weightX;
            gy += avg * weightY;
          }
        }

        let magnitude = Math.sqrt(gx * gx + gy * gy) >>> 0;
        output[px] = (255 << 24) | (magnitude << 16) | (magnitude << 8) | magnitude;
      }
    }

    return new ImageData(new Uint8ClampedArray(output.buffer), width, height);
  }

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
          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let edgeData = sobelEdgeDetection(imageData);
          ctx.putImageData(edgeData, 0, 0);

          const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
          zip.file(`frame_${frameCount}_edge.png`, blob, { binary: true });

          frameCount++;
          if (frameCount < 10) { // Limiting to 10 frames for demonstration
            video.currentTime += 0.5; // Capture every 0.5 seconds
          } else {
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = "frames_edge.zip";
            link.innerHTML = "Download Edge-Detected Frames as ZIP";
            downloadLinks.appendChild(link);
          }
        });

        video.currentTime += 0.5;
      });
    }
  });
});
