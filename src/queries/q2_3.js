const {MongoClient} = require('mongodb')
const mongoConnection = require('../config/mongo/mongoConnection.json')

MongoClient.connect(mongoConnection.url, (err, client) => {
    const db = client.db(mongoConnection.db)
    var col = db.collection('movies')
    col.aggregate([
        {$lookup: {from: "members", localField: "writers", foreignField: "_id", as: "abc"}},
        {$group: {_id: {writerId: "$members._id", writerName: "$members.name", writerDeathYear: "$member.deathyear"}, avgRunTime: {$avg: "$runtime"}}},
        {$match: {writerDeathYear: {$exists: false}, writerName: /Bhardwaj/}},
        {$project: {writerId: 1, avgRunTime: 1}}
    ]).toArray((err, docs) => {
        console.log(docs);
    })
})