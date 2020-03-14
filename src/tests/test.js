const {checkPGConnection, checkMongoConnection} = require('./connections')
const mongoConnection = require('../config/mongo/mongoConnection')
const pgConnection = require('../config/pg/pgConnection')

checkPGConnection(pgConnection, (status, err) => {
    if (err) {
        console.log(`Connection to PG FAILED!`);
        console.log(err);
        process.exit(1, err)
    }
    else {
        console.log(`Connection to PG SUCCESSFUL!`);
        checkMongoConnection(mongoConnection.url, (status, err) => {
            if (err) {
                console.log(`Connection to Mongo FAILED!`);
                console.log(err);
                process.exit(1, err)
            }
            else {
                console.log(`Connection to Mongo SUCCESSFUL!`);
                process.exit(0)
            }
        })
    }
})

process.on('exit', (code, err) => {
    switch(code) {
        case 0: 
            console.log(`ALL TESTS SUCCESSFUL!`);
            break
        case 1:
            console.log(err);
            console.log(`Few tests FAILED!`);
            break
    }
})