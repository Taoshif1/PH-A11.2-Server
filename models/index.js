const UserModel = require('./UserModel');

function initializeModels(collections) {
    return {
        user: new UserModel(collections.users),
    };
}

module.exports = { initializeModels };
