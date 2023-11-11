const pako = require('pako');

function compress(data) {
    return pako.deflate(JSON.stringify(data), { to: 'string' });
}

function decompress(base64Data) {
    const compressedData = Buffer.from(base64Data, 'base64');
    return JSON.parse(pako.inflate(compressedData, { to: 'string' }));
}


module.exports = {
    compress,
    decompress
};
