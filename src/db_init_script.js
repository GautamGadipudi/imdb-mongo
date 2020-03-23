db = connect("localhost:27017/imdb")

isMemberCollectionCreated = db.createCollection("members", {
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

if (isMemberCollectionCreated.ok == 1)
    print("members collection created SUCCESSFULLY!")
else {
    print(`members collection NOT created! ${isMemberCollectionCreated.errmsg}`)
}

isMovieCollectionCreated = db.createCollection("movies", {
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
                },
                type: {
                    bsonType: "string",
                    description: "must be a string."
                },
                originalTitle: {
                    bsonType: "string",
                    description: "must be a string."
                },
                startYear: {
                    bsonType: "int",
                    description: "must be an int."
                },
                endYear: {
                    bsonType: "int",
                    description: "must be an int."
                },
                runtime: {
                    bsonType: "int",
                    description: "must be an int."
                },
                averageRating: {
                    bsonType: "double",
                    description: "must be a double.",
                    maximum: 10,
                    minimum: 1
                },
                numVotes: {
                    bsonType: "int",
                    description: "must be an int."
                },
                genres: {
                    bsonType: "array",
                    description: "must be an array of genres (string).",
                    items: {
                        bsonType: "string",
                        description: "must be a string."
                    }
                },
                actors: {
                    bsonType: "array",
                    description: "must be an array of actor-roles objects.",
                    items: {
                        bsonType: "object",
                        description: "must be an actor object { actor: , roles: [X, Y, Z,…] }",
                        properties: {
                            actor: {
                                bsonType: "int",
                                description: "must be an int."
                            },
                            roles: {
                                bsonType: "array",
                                description: "must be an array of roles (string).",
                                items: {
                                    bsonType: "string",
                                    description: "must be a string."
                                }
                            }
                        }
                    }
                },
                directors: {
                    bsonType: "array",
                    description: "must be an array of director ids (int).",
                    items: {
                        bsonType: "int",
                        description: "must be an int."
                    }
                },
                writers: {
                    bsonType: "array",
                    description: "must be an array of writer ids (int).",
                    items: {
                        bsonType: "int",
                        description: "must be an int."
                    }
                },
                producers: {
                    bsonType: "array",
                    description: "must be an array of producer ids (int).",
                    items: {
                        bsonType: "int",
                        description: "must be an int."
                    }
                }
            }
        }
    }
})

if (isMovieCollectionCreated.ok == 1)
    print("movie collection created SUCCESSFULLY!")
else {
    print(`movie collection NOT created! ${isMovieCollectionCreated.errmsg}!`)
    quit()
}