const _ = require('lodash');
const {MongoClient} = require('mongodb')

const mongoConnection = require('../../config/mongo/mongoConnection.json')

const insert = (collectionName, values, callback) => {
    console.log(`Connecting to ${JSON.stringify(mongoConnection)} ...`);
    MongoClient.connect(mongoConnection.url, (err, client) => {
        if (!err) {
            console.log(`Connected to ${JSON.stringify(mongoConnection)}.`);
            const db = client.db(mongoConnection.db)
            const collection = db.collection(collectionName)
            var batch = collection.initializeUnorderedBulkOp()
            _.forEach(values, (document) => {
                batch.insert(document)
            })
            console.log(`Dumping into MongoDB.`);
            batch.execute((err, result) => {
                if (err)
                    console.log(err);
                else {
                    console.log(`Bulk inserted ${result.nInserted} rows.`);
                    callback()
                }                
                client.close()
            })
        }
        else {
            console.log(`Unable to connect to ${JSON.stringify(mongoConnection)}!`);
            callback(err)
        }        
    })
}

exports.insert = insert