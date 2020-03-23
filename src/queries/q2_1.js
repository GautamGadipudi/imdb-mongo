const {MongoClient} = require('mongodb')
const mongoConnection = require('../config/mongo/mongoConnection.json')

MongoClient.connect(mongoConnection.url, (err, client) => {
    const db = client.db(mongoConnection.db)
    var col = db.collection('movies')
    col.aggregate([
        {$lookup: {from: "members", localField: "actors.actor", foreignField: "_id", as: "abc"}},
        {$group: {_id: {actorId: "$members._id", actorName: "$members.name", actorDeathYear: "$member.deathyear"}, count: {$sum: 1}}},
        {$match: {startYear: 2014, count: 0, actorName: /^Phi/}},
        {$project: {actorId: 1, actorName: 1}}
    ]).toArray((err, docs) => {
        console.log(docs);
    })
})