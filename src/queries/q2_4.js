const {MongoClient} = require('mongodb')
const mongoConnection = require('../config/mongo/mongoConnection.json')

MongoClient.connect(mongoConnection.url, (err, client) => {
    const db = client.db(mongoConnection.db)
    var col = db.collection('movies')
    col.aggregate([
        {$lookup: {from: "members", localField: "producers", foreignField: "_id", as: "abc"}},
        {$group: {_id: {producerId: "$members._id", producerName: "$members.name", producerDeathYear: "$member.deathyear"}}},
        {$match: {producerDeathYear: {$exists: false}, runtime: {$gt: 120}}},
        {$project: {producerId: 1, producerName: 1, runtime: 1}}
    ]).sort({runtime: -1}).toArray((err, docs) => {
        console.log(docs[0]);
    })
})