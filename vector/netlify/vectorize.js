const cloudinary = require('cloudinary').v2;

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Initialize Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const { logo, colors } = event.body;

    try {
        const result = await cloudinary.uploader.upload(logo, {
            transformation: [
                { effect: `vectorize:${colors}` }
            ]
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ svgURL: result.secure_url })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to vectorize the image." })
        };
    }
};
