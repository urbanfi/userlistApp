var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const axios = require("axios");

var indexRouter = require("./routes/index");

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Set HTML engine**
app.engine("html", require("ejs").renderFile);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

//set directory
app.set("views", __dirname + "/views");
//static folder
app.use(express.static("staticfolder"));

const http = require("https");
// API to get list of user
const url = "https://reqres.in/api/users?page=";

// convert api response to html
function parseResult(userlist, res) {
  //  console.log(">>> parseResult");
  let html = "";

  // loop over userlist (json-array)
  for (let item of userlist) {
    for (let key of item) {
      html += "<p>";
      html +=
        "<h1>" +
        "This is: " +
        JSON.stringify(key.first_name).replace(/"/g, "") +
        " " +
        JSON.stringify(key.last_name).replace(/"/g, "") +
        "</h1>";
      html +=
        "<br>" +
        "<img src=" +
        JSON.stringify(key.avatar) +
        'alt="Avatar" >' +
        "</br>";
      html +=
        "<br>" +
        "email: " +
        JSON.stringify(key.email).replace(/"/g, "") +
        "</br>";
      html += "</p>";
    }
  }
  res.set("Content-Type", "text/html");
  res.send(html);
  return;
}

// request json data from api
async function doGetRequest(fullurl) {
  let res = await axios.get(fullurl);
  return res.data.data;
}

// On button press, getUsers post request is execute
// Calling API to get all users and render result to html
app.post("/getUsers", urlencodedParser, function (req, res) {
  // loop through all pages until api returns empty data object
  (async () => {
    let result = "";
    let resultsum = [];
    let page = 1;
    let currentpage = "";
    while (true) {
      currentpage = url + page;
      result = await doGetRequest(currentpage);
      if (result == "") {
        //		console.log("end of data");
        break;
      }
      // add current json result to previous
      resultsum.push(result);
      page = page + 1;
    }

    parseResult(resultsum, res);
  })();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
