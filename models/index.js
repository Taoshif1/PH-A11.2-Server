// models/index.js
const UserModel = require('./UserModel');

function initializeModels(collections) {
    return {
        user: new UserModel(collections.users),
        // future models: donationRequest, funding, etc.
    };
}

module.exports = { initializeModels };
