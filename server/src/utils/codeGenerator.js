// Here we are fabricating a scalable code generator that helps in otp generation and hex-codes in future


// defined
const generateNumericCode = (length = 6) => {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    return Math.floor(Math.random() * (max - min + 1)) + min        // eg, 3454
}


const generateFormattedHexCode = () => {
    const rawHex = [...Array(24)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')

    return rawHex.match(/.{1,4}/g).join('-')                        // eg, "a3f2-d2c4-91b7-4e8a-9b6d-10fc"
}


const generateCode = ({ type = 'numeric', length = 6 } = {}) => {
    if (type === 'numeric') return String(generateNumericCode(length));
    if (type === 'hex') return String(generateFormattedHexCode());
    return null;
};


// exports
export default generateCode