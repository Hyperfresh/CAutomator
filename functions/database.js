const db = require('../index').db

function Search(search) /* Search for a user via memberid. */ {
    return db.get('profiles')
        .find({memberid: search})
        .value()
}

module.exports = { Search }