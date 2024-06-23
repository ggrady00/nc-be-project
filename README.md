# News API

## Project Summary
Built an API to allow access to application data with the intention to mimic a real backend service that provides information for a front end architecture. The API is available online at https://news-api-ayb1.onrender.com.

## Instructions
First clone the repository to your local machine and install the dependencies using
```
npm install
```
### Database setup
You will need to create two enviornment variables `.env.test` and `.env.development`:

In `.env.test`:
>PGDATABASE=nc_news_test

In `.env.development`:
>PGDATABASE=nc_news

Run the following commands to create and seed the databases.
```
npm run setup-dbs
npm run seed
```
## Running the application
To start the application use
```npm start```

A list of available endpoints is accessible on https://news-api-ayb1.onrender.com/api