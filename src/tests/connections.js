const {Client} = require('pg')
const {MongoClient} = require('mongodb')

const checkPGConnection = (pgConnection, callback) => {
    const client = new Client(pgConnection)
    client.connect(err => {
        if (!err)
            callback(true)
        else
            callback(false, err)
    })
}

const checkMongoConnection = (mongoConnection, callback) => {
    MongoClient.connect(mongoConnection, (err) => {
        if (!err)
            callback(true)
        else
            callback(false, err)
    })
}

exports.checkMongoConnection = checkMongoConnection
exports.checkPGConnection = checkPGConnection