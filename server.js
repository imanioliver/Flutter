const express           = require("express");
const mustacheExpress   = require("mustache-express");
const path              = require("path");
const morgan            = require("morgan");
const bodyParser        = require("body-parser");
const routes            = require("./routes/index");
const expressValidator  = require("express-validator");
const Session           = require("express-session");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.set("layout", "layout")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.use(routes);

app.listen(3000, function(){
    console.log("Imani, the app is running on 3000.");
});
