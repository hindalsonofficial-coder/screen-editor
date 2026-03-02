export const downloadURI = (uri: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Convert data URI to different format
export const convertImageFormat = (
    dataUri: string,
    format: 'png' | 'jpg',
    quality: number = 0.92
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            const outputFormat = format === 'jpg' ? 'jpeg' : 'png';
            
            try {
                const convertedDataUri = canvas.toDataURL(mimeType, quality);
                resolve(convertedDataUri);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUri;
    });
};

// Batch download multiple files with delay
export const downloadMultipleFiles = async (
    files: Array<{ dataUri: string; fileName: string }>,
    delay: number = 300
) => {
    for (let i = 0; i < files.length; i++) {
        if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        downloadURI(files[i].dataUri, files[i].fileName);
    }
};
