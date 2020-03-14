const {getAllMembers} = require('./services/pg/get')
const {insertMembers} = require('./services/mongo/insert')

getAllMembers((members, err) => {
    if (!err) {
        insertMembers(members, (err) => {
            if (!err)
                process.exit(0)
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