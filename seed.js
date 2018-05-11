const mongo = require('./mongo');
const users = require('./users');
const posts = require('./posts');
const messages = require('./messages');

const userOne = {
  username: "testUser1",
  password: "testPassword"
};

const userTwo = {
  username: "testUser2",
  password: "testPassword2"
};

const post = {
  content: "This is a test post.",
  poster: userOne.username
};

// Seed the database with sample data.
async function seed () {
  await mongo.clear();

  // Create two users.
  console.log("Creating users.");
  await users.createUser(userOne);
  await users.createUser(userTwo);

  console.log("Creating subscription.");
  // Subscribe userTwo to userOne.
  await users.addSubscription(userTwo.username, userOne.username);

  console.log("Creating post.");
  // Create post for userOne.
  await posts.createPost(post);

  console.log("Creating messages.");
  // Add messages between userOne and userTwo.
  await messages.createMessage("Hey userTwo!", userOne.username, userTwo.username);
  await messages.createMessage("Hi userOne! What's up?", userTwo.username, userOne.username);
  await messages.createMessage("Nothing much.", userOne.username, userTwo.username);
  console.log("Done.");

  process.exit(0);
}

seed();
