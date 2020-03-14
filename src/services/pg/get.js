const _ = require('lodash');
const {Client} = require('pg')

const pgConnection = require('../../config/pg/pgConnection.json')

const client = new Client(pgConnection)

const getAllMembers = (callback) => {
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
        .catch(e => {
            console.log(`Query FAILED!`);
            callback(null, e)
        })
}

exports.getAllMembers = getAllMembers