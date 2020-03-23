const {MongoClient} = require('mongodb')
const mongoConnection = require('../config/mongo/mongoConnection.json')

MongoClient.connect(mongoConnection.url, (err, client) => {
    const db = client.db(mongoConnection.db)
    var col = db.collection('members')
    col.aggregate([
        {$lookup: }
    ]).toArray((err, docs) => {
        console.log(docs);
    })
})