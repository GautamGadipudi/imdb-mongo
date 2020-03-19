const _ = require('lodash');
const {Client} = require('pg')

const pgConnection = require('../../config/pg/pgConnection.json')

const client = new Client(pgConnection)
client.connect()

const getAllMembers = (callback) => {
    console.log(`Connected to PG DB ${JSON.stringify(_.pick(pgConnection, ['user', 'host', 'database']))}`);
    query = `SELECT id _id, 
                    name, 
                    birthyear birthYear, 
                    deathyear deathYear 
            FROM member`
    console.log(`EXEC query ${query} ...`);
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

const getAllMovies = (callback) => {
    console.log(`Connected to PG DB ${JSON.stringify(_.pick(pgConnection, ['user', 'host', 'database']))}`);
    query = `SELECT m.id _id,
                m.type,
                m.title,
                m.originaltitle originalTitle,
                m.startyear startYear,
                m.endyear endYear,
                m.runtime,
                m.avgrating averageRating,
                m.numvotes numVotes,
                JSON_AGG(DISTINCT foo2.name) genres,
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
            LEFT OUTER JOIN (SELECT mg.movie,
                g.name 
                FROM movie_genre mg
                INNER JOIN genre g
                    ON mg.genre = g.id
            ) AS foo2
            ON foo2.movie = m.id
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

exports.getAllMembers = getAllMembers
exports.getAllMovies = getAllMovies