
module.exports = app => {

    app.get("/", function (req, res) {
        // Provide the homepage
        let url = path.resolve("index.html");
        res.sendFile(url);
    });

    app.get("/site.css", function (req, res) {
        // Provide the CSS
        let url = path.resolve("site.css");
        res.sendFile(url);
    });

    app.get("/u/*", function (req, res) {
        // TODO: Respond with the user's profile iff it exists
    });

}
