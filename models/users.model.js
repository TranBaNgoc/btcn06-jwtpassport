var db = require('../utils/db')
module.exports = {

    // Get all
    all: ()=>{
        return db.load('SELECT * FROM user');
    },

    // Get by id
    single: username => {
        return db.load(`SELECT * FROM user WHERE username = '${username}'`);
    },

    // Insert
    add: entity => {
        return db.add(`user`, entity);
    },    

    update: entity => {
        return db.update(`user`, `username`, entity);
    }
};