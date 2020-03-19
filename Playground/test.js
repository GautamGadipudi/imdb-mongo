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

const getMovies = (callback) => {
    client.connect()
    query = `SELECT m.id _id,
    m.type,
    m.title,
    m.originaltitle originalTitle,
    m.startyear startYear,
    m.endyear endYear,
    m.runtime,
    m.avgrating averageRating,
    m.numvotes numVotes,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('actor', actor, 'roles', roles)) actors,
    JSON_AGG(DISTINCT md.director) directors,
    JSON_AGG(DISTINCT mp.producer) producers,
    JSON_AGG(DISTINCT mw.writer) writers
    FROM movie m
    LEFT OUTER JOIN (SELECT amr.movie, 
            amr.actor, 
            JSON_AGG(DISTINCT r.name) roles
            FROM actor_movie_role amr
            INNER JOIN role r
                ON amr.role = r.id
            GROUP BY amr.movie, amr.actor
    ) AS foo
        ON foo.movie = m.id
    LEFT OUTER JOIN movie_director md
        ON md.movie = m.id
    LEFT OUTER JOIN movie_producer mp
        ON mp.movie = m.id
    LEFT OUTER JOIN movie_writer mw
        ON mw.movie = m.id
    GROUP BY m.id`,
    console.log(`EXEC query ${query}`);
    client
    .query(query)
        .then((res) => {
            console.log(`Retrieved ${res.rowCount} rows from PG DB.`);
            result = res.rows;
            x = result.map((item) => {
                return _.pickBy(item)
            })            
            callback(x)
        })
        .catch(e => {
            console.log(`Query FAILED!`);
            callback(null, e)
        })
}

// const get_results = (callback) => {
//     client.connect()
//     console.log(`Connected to PG DB ${JSON.stringify(_.pick(pgConnection, ['user', 'host', 'database']))}`);
//     query = 'SELECT * FROM member'
//     console.log(`EXEC query ${query} ...`);
//     client
//     .query(query)
//         .then((res) => {
//             console.log(`Retrieved ${res.rowCount} rows from PG DB.`);
//             result = res.rows;
//             x = result.map((item) => {
//                 item = _.mapKeys(item, (v, k) => {
//                     if (k == 'id')
//                         return '_id'
//                     else
//                         return k
//                 })
//                 return _.pickBy(item)
//             })            
//             callback(x)
//         })
//         .catch(e => console.log(e.stack))
// }

const dump_to_mongo = (collectionName, results, callback) => {
    console.log(`Connecting to ${JSON.stringify(mongoConnection)} ...`);
    MongoClient.connect(mongoConnection.url, (err, client) => {
        if (!err) {
            console.log(`Connected to ${JSON.stringify(mongoConnection)}.`);
            const db = client.db(mongoConnection.db)
            const collection = db.collection(collectionName)
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

getMovies((results, err) => {
    if (!err) {
        dump_to_mongo("movies", results, (err) => {
            if (!err) {
                process.exit(0)
            }
            else {
                process.exit(1, err)
            }
        })
    }
    else
        process.exit(1, err)
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




