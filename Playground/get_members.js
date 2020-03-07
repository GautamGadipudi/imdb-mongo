const {Client} = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Ipodshuffle1',
    port: 54321
})

client.connect()

client.query('SELECT * FROM member LIMIT 10')
    .then(res => console.log(res))
    .catch(err => console.log(err))