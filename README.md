# LIve Electronic Breakroom - LIEB

LIEB is a social media application. Users can create profiles and then create posts. They can subscribe to other users to see their posts,
and react to them.

# Seeding the database
First configure your database connection info in `mongoConnection.json`.

Run `npm run seed` to seed the database with sample data. After seeding, you can
log in as any of the users added in the `seed.js` file. For example, you can login as
`testUser1` with password `testPassword`.

# Launching the app
Run `npm start` to launch the app. By default is will be available at `localhost:3000`.
