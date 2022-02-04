const axios = require('axios');
const wikiUrl = 'https://tamagotchi.fandom.com/wiki/';
const tamaCharactersUrl = `${wikiUrl}Category:Tamagotchi_characters?from=`;
// A - Z
const charCategories = [...Array(26).keys()].map(i => String.fromCharCode(i + 65));
// ¡ = Other
charCategories.push('¡');

const fragmentCacheByCategory = new Map();

async function getRandomCharacter() {
    const category = charCategories[Math.floor(Math.random() * charCategories.length)];
    const url = `${tamaCharactersUrl}${category}`;

    let groups;
    const cache = fragmentCacheByCategory.get(category);
    if (cache) {
        groups = cache;
    } else {
        const { data } = await axios.get(url);

        const div = data.slice(data.indexOf('<div class="category-page__members">'), data.indexOf('<div class="category-page__pagination">'));

        groups = [...div.matchAll(/<noscript>(.+?)<\/noscript>/gs)];
    }

    if (groups.length > 0) {
        if (!cache) {
            fragmentCacheByCategory.set(category, groups);
        }
        return getCharacterInfoFromGroupsHtmlFragment(groups)
    } else {
        return {img: '', name: 'Errortchi', link: url};
    }
}

function getCharacterInfoFromGroupsHtmlFragment(groups) {
    const source = groups[Math.floor(Math.random() * groups.length)][1] || '';
    const matches = source.match(/src="(.+?)".+?alt="(.+?)"/s);

    let [, img, name] = matches || [];

    if (!name || name.includes(':')) {
        return getCharacterInfoFromGroupsHtmlFragment(groups);
    } else {
        // Scale up img, keep the cache bust value
        img = img.replace(/\/revision\/latest\/(.+?)\?cb=/, '/revision/latest/scale-to-width-down/320?cb=');

        const link = `${wikiUrl}${encodeURIComponent(name)}`;
        return { img, name, link };
    }
}

// Test
// getRandomCharacter().then(r => console.log(r));

// Clear cache every day
setInterval(function() {
    fragmentCacheByCategory.clear();
}, 24 * 60 * 60 * 1000);

module.exports = {
    getRandomCharacter,
};
