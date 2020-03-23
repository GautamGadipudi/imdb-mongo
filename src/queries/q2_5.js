const {MongoClient} = require('mongodb')
const mongoConnection = require('../config/mongo/mongoConnection.json')

MongoClient.connect(mongoConnection.url, (err, client) => {
    const db = client.db(mongoConnection.db)
    var col = db.collection('movies')
    col.aggregate([
        {$lookup: {from: "members", localField: "directors", foreignField: "_id", as: "dir"}},
        {$lookup: {from: "members", localField: "actors.actor", foreignField: "_id", as: "act"}},
        {$match: {genres: "sci-fi", "$dir.name": "James Cameron", "$act.name": "Sigourney Weaver"}},
    ]).toArray((err, docs) => {
        console.log(docs);
    })
})