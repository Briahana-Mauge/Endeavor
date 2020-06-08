const storage = require('./s3Service');
const { checkSlug } = require('../queries/users');


const formatStr = str => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const generateSlug = async (name) => {
    let slug = name;
    if (slug.length > 24) {
        slug = slug.slice(0, 23);
    }
    const str = '1234567890qwertyuiopasdfghjklzxcvbnm';
    for (let i=0; i<7; i++) {
        const randomIndex = Math.floor(Math.random() * str.length);
        slug += str[randomIndex];
    }
    const existingSlug = await checkSlug(slug);
    if (existingSlug) {
        generateSlug(name);
    }
    return slug;
}

module.exports = {
    formatStr,
    generateSlug,
}