db.movies.aggregate([
    {$lookup: {from: "members", localField: "actors.actor", foreignField: "_id", as: "abc"}},
    {$group: {_id: {actorId: "$members._id", actorName: "$members.name", actorDeathYear: "$member.deathyear"}, count: {$sum: 1}}},
    {$match: {startYear: 2014, count: 0, actorName: /^Phi/, actorDeathYear: {$exists: false}}},
    {$project: {actorId: 1, actorName: 1}}
])