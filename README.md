# imdb-mongo
Load IMDB data from relational tables in PostgreSQL to MongoDB collections using NodeJS.

## Required applications:
* MongoDB v4.x.x
* npm v6.x.x
* NodeJS v12.x.x
* PostgreSQL v12.1

## Create collections in MongoDB
* Open a terminal in the root of the repo.
* Execute the following:
```bash
mongo ./db_init_script.js
```

## Test if connection to both databases are successful
* Open a terminal in the root of the repo.
* Execute the following:
```bash
npm test
```

## Copy data from PG DB to MongoDB
* Open a terminal in the root of the repo.
* Execute the following:
```bash
npm start
```

## Query questions
* Execute the following in a terminal opened in the queries folder:
```bash
node q2_x.js
```