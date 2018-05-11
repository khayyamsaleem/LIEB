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

const userThree = {
  username: "ladies",
  password: "washroom"
}

const userFour = {
  username: "employees",
  password: "mustwashhands"
}

const userFive = {
  username: "max",
  password: "imumoccupancy120"
}

const post = {
  content: "This is a test post.",
  poster: userOne.username
};

const p4a = {
  content: "Feeling dirty",
  poster: userFour.username
}

const p4b = {
  content: "I haven't washed my hands in 45 years",
  poster: userFour.username
}

const p5a = {
    content: "Has anybody seen nuclear nadal?",
    poster: userFive.username
}

const p3a = {
    content: "There is no earthly fire that can destroy the royal beard",
    poster: userThree.username
}
const p3b = {
    content: "The flames of the righteous attack the unjust!",
    poster: userThree.username
}

// Seed the database with sample data.
async function seed () {
  await mongo.clear();

  // Create two users.
  console.log("Creating users.");
  await users.createUser(userOne);
  await users.createUser(userTwo);
  await users.createUser(userThree);
  await users.createUser(userFour);
  await users.createUser(userFive);

  console.log("Creating subscription.");
  // Subscribe userTwo to userOne.
  await users.addSubscription(userTwo.username, userOne.username);
  await users.addSubscription(userTwo.username, userThree.username);
  await users.addSubscription(userTwo.username, userFive.username);
  await users.addSubscription(userOne.username, userTwo.username);
  await users.addSubscription(userOne.username, userFive.username);
  await users.addSubscription(userOne.username, userThree.username);
  await users.addSubscription(userThree.username, userOne.username);
  await users.addSubscription(userThree.username, userTwo.username);
  await users.addSubscription(userThree.username, userThree.username);
  await users.addSubscription(userThree.username, userFour.username);
  await users.addSubscription(userThree.username, userFive.username);
  await users.addSubscription(userFour.username, userTwo.username);

  console.log("Creating post.");
  // Create post for userOne.
  const worked = await posts.createPost(post);
  await posts.createPost(p4a);
  await posts.createPost(p4b);
  await posts.createPost(p5a);
  await posts.createPost(p3a);
  await posts.createPost(p3b);

  console.log("Creating messages.");
  // Add messages between userOne and userTwo.
  await messages.createMessage("Hey userTwo!", userOne.username, userTwo.username);
  await messages.createMessage("Hi userOne! What's up?", userTwo.username, userOne.username);
  await messages.createMessage("Nothing much.", userOne.username, userTwo.username);

  await messages.createMessage("what is your name!", userOne.username, userFour.username);
  await messages.createMessage("employees", userFour.username, userOne.username);
  await messages.createMessage("'employees' what?.", userOne.username, userFour.username);
  await messages.createMessage("employees... mustwashhands", userFour.username, userOne.username);
  await messages.createMessage("That is a made up name. What is your real name?", userOne.username, userFour.username);
  await messages.createMessage("...", userFour.username, userOne.username);

  await messages.createMessage("what's cookin good lookin", userTwo.username, userThree.username);
  await messages.createMessage("u stay flirtin oh ma gaash", userThree.username, userTwo.username);
  await messages.createMessage("u gna go to the club friday?", userThree.username, userTwo.username);
  await messages.createMessage("dayum gyal whatchu thank", userTwo.username, userThree.username);
  await messages.createMessage("u aint change u aint nva gna change smh", userThree.username, userTwo.username);
  await messages.createMessage("🙈", userFour.username, userOne.username);

  console.log("Done.");

  process.exit(0);
}

seed();
