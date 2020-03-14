db = connect("localhost:27017/imdb")

created = db.createCollection("members", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name"],
            properties: {
                _id: {
                    bsonType: "int",
                    description: "must be an int and is required."
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required."
                }
            }
        }
    }
})
    
printjson(created)