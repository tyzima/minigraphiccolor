const downloadBtn = document.getElementById('downloadBtn');
const urlList = document.getElementById('urlList');

downloadBtn.addEventListener('click', async () => {
    const urls = urlList.value.split(/,|\n/).map(url => url.trim()).filter(Boolean);
    const zip = new JSZip();

    for (const [index, url] of urls.entries()) {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop();
        zip.file(fileName || `image-${index + 1}.jpg`, blob);
    }

    zip.generateAsync({ type: "blob" })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'images.zip';
            link.click();
            URL.revokeObjectURL(link.href);
        });
});
