const {random} = require("../lib/random");
const {devices} = require('../tamas.json');

function getRandomTama() {
    return devices[Math.floor(random() * devices.length)];
}

module.exports = {
    getRandomTama
};
