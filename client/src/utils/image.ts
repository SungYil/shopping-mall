export const getOptimizedImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';

    // Google Drive Viewer Link -> Direct Link 변환
    // 예: https://drive.google.com/file/d/123456789/view?usp=sharing
    // -> https://drive.google.com/uc?export=view&id=123456789
    if (url.includes('drive.google.com') && url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=view&id=${match[1]}`;
        }
    }

    return url;
};
