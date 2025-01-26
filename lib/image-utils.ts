// lib/image-utils.ts

// Convert a File object to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

// Convert base64 string back to Blob for display
export const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
};

export const compressImage = (file: File, maxSizeMB = 1): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > 1200) {
                    height = Math.round((height * 1200) / width);
                    width = 1200;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }));
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    0.7 // compression quality
                );
            };
        };
        reader.onerror = error => reject(error);
    });
};

// creating text image
export function createTextImage(departmentCode: string, w: 200, h: 200) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = w; // Set width
    canvas.height = h; // Set height

    ctx.fillStyle = 'white'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black'; // Text color
    ctx.font = '30px Arial';
    ctx.fillText(departmentCode, 50, 50); // Draw text

    const img = canvas.toDataURL('image/png'); // Convert to PNG
    return img; // You can use this image data URL
}
