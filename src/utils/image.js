/**
 * @param {String} imageString - an iamge string of base64 encode
 */
export const dataUrl = (imageString) => {
    const dataBase64 = imageString.startsWith('data:') && imageString.includes(';base64,')
    ? imageString.split(',')[1]
    : imageString;
    
    return Buffer.from(dataBase64, 'base64');
}