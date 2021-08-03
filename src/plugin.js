const { plugin } = require("learnpack/plugin")

module.exports = plugin({
    language: "python3",
    compile: require('./compile'),
    test: require('./test'),
})