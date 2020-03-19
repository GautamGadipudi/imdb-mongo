const {getAllMembers, getAllMovies} = require('./services/pg/get')
const {insert} = require('./services/mongo/insert')

getAllMembers((members, err) => {
    if (!err) {
        insert("members", members, (err) => {
            if (!err) {
                getAllMovies((results, err) => {
                    if (!err) {
                        insert("movies", results, (err) => {
                            if (!err)
                                process.exit(0)
                            else
                                process.exit(1, err)
                        })
                    }   
                    else
                        process.exit(1, err)                     
                })
            }
            else
                process.exit(1, err)
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