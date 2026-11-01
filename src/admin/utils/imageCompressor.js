/**
 * Tiện ích nén ảnh sang định dạng WebP ngay trên trình duyệt (Client-side)
 * Giải pháp 0đ: Giảm dung lượng ảnh từ vài MB xuống còn dưới 150KB trước khi upload
 */
function compressImageToWebP(file, maxWidth = 1600, quality = 0.8) {
    return new Promise((resolve, reject) => {
        // 1. Dùng FileReader để đọc dữ liệu file ảnh dưới dạng DataURL
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                // 2. Tính toán lại kích thước tỷ lệ ảnh nếu ảnh gốc quá lớn
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // 3. Sử dụng thẻ Canvas của HTML5 để vẽ lại ảnh với kích thước mới
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 4. Xuất ảnh ra định dạng 'image/webp' với chất lượng nén mong muốn
                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject(new Error('Lỗi khi nén ảnh sang định dạng WebP!'));
                    }
                    // Tạo đối tượng File mới với phần mở rộng .webp
                    const webpFileName = file.name.replace(/\.[^/.]+$/, "") + '.webp';
                    const compressedFile = new File([blob], webpFileName, { type: 'image/webp' });
                    resolve(compressedFile);
                }, 'image/webp', quality);
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
}

