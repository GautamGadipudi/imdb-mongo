var _ = require('lodash');

const {Client} = require('pg')
const {MongoClient} = require('mongodb')

const mongoConnection = {
    url: "mongodb://localhost:27017",
    db: "imdb"
}

const pgConnection = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Ipodshuffle1',
    port: 54321
}

const client = new Client(pgConnection)

const get_results = (callback) => {
    client.connect()
    console.log(`Connected to PG DB ${JSON.stringify(_.pick(pgConnection, ['user', 'host', 'database']))}`);
    query = 'SELECT * FROM member'
    console.log(`EXEC query ${query} ...`);
    client
    .query(query)
        .then((res) => {
            console.log(`Retrieved ${res.rowCount} rows from PG DB.`);
            result = res.rows;
            x = result.map((item) => {
                item = _.mapKeys(item, (v, k) => {
                    if (k == 'id')
                        return '_id'
                    else
                        return k
                })
                return _.pickBy(item)
            })            
            callback(x)
        })
        .catch(e => console.log(e.stack))
}

const dump_to_mongo = (results, callback) => {
    console.log(`Connecting to ${JSON.stringify(mongoConnection)} ...`);
    MongoClient.connect(mongoConnection.url, (err, client) => {
        if (!err) {
            console.log(`Connected to ${JSON.stringify(mongoConnection)}.`);
            const db = client.db(mongoConnection.db)
            const collection = db.collection("members")
            var batch = collection.initializeUnorderedBulkOp()
            _.forEach(results, (document) => {
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

get_results((results) => {
    dump_to_mongo(results, (err) => {
        if (!err) {
            process.exit(0)
        }
        else {
            process.exit(1, err)
        }
    })
})

process.on('exit', (code, err) => {
    switch(code) {
        case 0: 
            console.log(`PROCESS COMPLETE!`);
            break
        case 1:
            console.log(err);
            console.log(`PROCESS FAILED!`);
            break
    }
})




