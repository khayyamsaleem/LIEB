const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const configRoutes = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

configRoutes(app);

app.listen(3000, () => {
    console.log("Lieb is running!");
});
