var express = require("express");
const bodyParser = require('body-parser');
var path = require("path");
var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static("node_modules"));
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/apiroutes")(app)
require("./routes/htmlroutes")(app)

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
