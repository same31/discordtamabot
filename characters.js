const axios = require('axios');
const { random } = require('./random');
const wikiUrl = 'https://tamagotchi.fandom.com/wiki/';
const tamaCharactersUrl = `${wikiUrl}Category:Tamagotchi_characters?from=`;
// A - Z
const charCategories = [...Array(26).keys()].map(i => String.fromCharCode(i + 65));
// FIXME: ¡ = Other / does not work properly
// charCategories.push('¡');

let characters = [];

async function populateCharacters(debug = false) {
    let charactersTmp = [];

    const l = charCategories.length;
    let i = 0;
    for (; i < l; i++) {
        const category = charCategories[i];
        charactersTmp = charactersTmp.concat(await getCharactersForCategory(category));
        console.log(`Characters for category ${category} found.`);
    }
    characters = charactersTmp;

    // Repopulate in 24 hours
    setTimeout(function() {
        populateCharacters(false);
    }, 24 * 60 * 60 * 1000);
}

populateCharacters(true).then(() => {
    // Test
    getRandomCharacter().then(r => console.log(r));
});

async function getCharactersForCategory(category) {
    let groups;
    try {
        const url = `${tamaCharactersUrl}${category}`;
        const {data} = await axios.get(url);
        const div = data.slice(data.indexOf('<div class="category-page__members">'), data.indexOf('<div class="category-page__pagination">'));
        groups = [...div.matchAll(/<noscript>(.+?)<\/noscript>/gs)];
    }
    catch (err) {
        console.error(err);
        groups = [];
    }

    if (groups.length <= 0) {
        // Wait 1s before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getCharactersForCategory(category);
    }

    return groups.map(group => getCharacterInfoFromGroup(group)).filter(char => char.name && !char.name.includes(':'));
}

function getCharacterInfoFromGroup(group = []) {
    const source = group[1] || '';
    const matches = source.match(/src="(.+?)".+?alt="(.+?)"/s);

    let [, img, name] = matches || [];

    // Scale up img, keep the cache bust value
    img = img.replace(/\/revision\/latest\/(.+?)\?cb=/, '/revision/latest/scale-to-width-down/320?cb=');

    const link = `${wikiUrl}${encodeURIComponent(name)}`;
    return { img, name, link };
}

async function getRandomCharacter() {
    const nbChars = characters.length;
    if (nbChars <= 0) {
        return false;
    }
    return characters[Math.floor(random() * nbChars)];
}

module.exports = {
    getRandomCharacter,
};
