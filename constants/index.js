const REST_API_LOCAL_ENDPOINT = "http://localhost:3000"

const whitelist = ["http://localhost:3001"]
const CORS_CONFIG = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

module.exports = {
    REST_API_LOCAL_ENDPOINT,
    CORS_CONFIG
}
