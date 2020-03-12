require("dotenv").config()

const mongoose = require("mongoose")

const dbURL =
    process.env.NODE_ENV !== "production"
        ? process.env.MONGO_DEV_CONNECTION_STRING
        : process.env.MONGO_PRODUCTION_CONNECTION_STRING

async function connectMongoose() {
    return await mongoose
        .connect(dbURL, {
            promiseLibrary: global.Promise,
            // This option is on by default, but why not set it explicitly
            auto_reconnect: true,
            // This options is 1 second by default, its possible the ha
            // takes longer than 30 seconds to recover.
            reconnectInterval: 5000,
            // This options is 30 by default, why not make it 60
            reconnectTries: 5,
            useNewUrlParser: true
        })
        .then(() => {
            return true
        })
        .catch(err => {
            return err
        })
}

module.exports = {
    connectMongoose
}
