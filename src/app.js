const {getAllMembers, getAllMovies} = require('./services/pg/get')
const {insert} = require('./services/mongo/insert')
require('./events/events')

getAllMembers((members, err) => {
    if (!err) {
        insert("members", members, (err) => {
            if (err)
                process.exit(1, err)
        })
    }
    else
        process.exit(1, err)    
})

getAllMovies((movies, err) => {
    if (!err) {
        insert("movies", movies, (err) => {
            if (!err)
                process.exit(0)
            else
                process.exit(1, err)
        })
    }   
    else
        process.exit(1, err)   
})