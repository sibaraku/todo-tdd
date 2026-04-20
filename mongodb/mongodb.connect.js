const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://admin:secret@localhost:27017/tests', {
        authSource: "admin"
    });
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = { connect };