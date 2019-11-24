var path = require("path");

module.exports = function(app) {

  app.get("/mymedfund", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/mymedfund.html"));
  });

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};