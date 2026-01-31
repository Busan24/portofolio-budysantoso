/**
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder name in Cloudinary (e.g., 'achievements', 'projects')
 * @returns {Promise<{url: string, publicId: string}>} - Cloudinary URL and public ID
*/
export const uploadToCloudinary = async (file, folder = 'portfolio') => {
    if (!file) {
        throw new Error('No file provided');
    }

    if (folder === 'cv') {
        const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validDocTypes.includes(file.type)) {
            throw new Error('Invalid file type for CV. Only PDF, DOC, and DOCX are allowed.');
        }
    } else {
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
        }
    }

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 10MB.');
    }

    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary configuration missing. Check your .env.local file.');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        const timestamp = Date.now();
        formData.append('public_id', `${timestamp}_${file.name.split('.')[0]}`);

        const resourceType = folder === 'cv' ? 'raw' : 'image';
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        
        console.log('Uploading to Cloudinary:', {
            folder,
            fileName: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type
        });

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Upload failed');
        }

        const data = await response.json();

        console.log('Upload successful:', {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format,
            resourceType: data.resource_type,
            accessMode: data.access_mode
        });

        let finalUrl = data.secure_url;
        if (folder === 'cv' && data.resource_type === 'raw') {
            finalUrl = data.secure_url.replace('/upload/', '/upload/fl_attachment/');
        }

        return {
            url: finalUrl,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            resourceType: data.resource_type
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};

/**
 * @param {string} publicId - The public ID of the image
 */
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) {
        console.warn('No public ID provided for deletion');
        return;
    }

    
    console.log('Image deletion requested:', publicId);
    console.log('Note: Manual deletion required from Cloudinary dashboard or implement backend API');
    
    return { success: true, message: 'Deletion noted' };
};

/**
 * @param {string} publicIdOrUrl 
 * @param {number} width 
 * @param {number} height 
 * @returns {string} 
 */
export const getOptimizedImageUrl = (publicIdOrUrl, width = 800, height = 600) => {
    if (!publicIdOrUrl) {
        return '/assets/placeholder.png';
    }

    // If it's already a full URL, return as is
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
        return publicIdOrUrl;
    }

    // If it's a local path, return as is
    if (publicIdOrUrl.startsWith('/')) {
        return publicIdOrUrl;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'djl755enm';
    
    // Use c_limit instead of c_fill to avoid cropping and potential errors
    // c_limit ensures the image fits within dimensions without cropping
    const transformations = `w_${width},h_${height},c_limit,q_auto,f_auto`;
    
    // Clean public_id - remove any leading/trailing slashes and extra spaces
    const cleanPublicId = publicIdOrUrl.trim().replace(/^\/+|\/+$/g, '');
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${cleanPublicId}`;
};

/**
 * @param {string} publicIdOrUrl 
 * @param {number} size 
 * @returns {string}
 */
export const getThumbnailUrl = (publicIdOrUrl, size = 200) => {
    return getOptimizedImageUrl(publicIdOrUrl, size, size);
};
