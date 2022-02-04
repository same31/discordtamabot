const MersenneTwister = require('mersenne-twister');
const generator = new MersenneTwister();

module.exports = {
    random: () => { return generator.random(); },
};
