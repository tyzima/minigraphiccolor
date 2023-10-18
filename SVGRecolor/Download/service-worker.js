self.addEventListener('fetch', (event) => {
    event.respondWith(async function() {
        try {
            const res = await fetch(event.request, {
                mode: 'no-cors' // This bypasses the CORS check
            });
            return res;
        } catch (error) {
            console.error('Fetch failed:', error);
            throw error;
        }
    }());
});
