const pause = (duration) => new Promise((res) => setTimeout(res, duration));

module.exports = pause;