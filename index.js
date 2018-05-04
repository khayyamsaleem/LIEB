const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const auth = require("./auth");

const port = 3000;

app.use("/public", static);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(auth);

configRoutes(app);

app.listen(port, () => {
    console.log(`Lieb is running on port ${port}!`);
});
