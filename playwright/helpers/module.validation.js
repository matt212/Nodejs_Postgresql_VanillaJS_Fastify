function generateRandomAlphabetic(maxLength) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const length = Math.min(maxLength, Math.floor(Math.random() * 6) + 5);
    let value = '';
    for (let i = 0; i < length; i++) value += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return value;
}

function generateTestValue(field) {
    const { fieldvalidatename, fieldmaxlength } = field;
    const maxLength = Number(fieldmaxlength) || 45;
    switch (fieldvalidatename.toLowerCase()) {
        case 'string': return generateRandomAlphabetic(maxLength);
        case 'alphanumeric': return 'A1'.repeat(Math.ceil(Math.min(maxLength, 10) / 2)).substring(0, maxLength);
        case 'number':
        case 'integer': return '123';
        case 'decimal': return '123.45';
        case 'date': return '01-11-1990';
        case 'boolean': return true;
        default: throw new Error(`Unsupported field validation type: ${fieldvalidatename}`);
    }
}

module.exports = { generateRandomAlphabetic, generateTestValue };
