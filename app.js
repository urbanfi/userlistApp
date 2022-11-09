var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set HTML engine**
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//set directory
app.set('views', __dirname + '/views');
//static folder
app.use(express.static('staticfolder'));

app.get('/', function(req, res) {
    //open form.ejs from the views directory
    res.render('form');
});

app.get('/form', function(req, res) {
    //open form.ejs from the views directory
    res.render('form');
});


const http = require('https');
//const url = "https://jsonplaceholder.typicode.com/posts";
//const url = "https://reqres.in/api/users"
const url = "https://reqres.in/api/users?page="


function parseResult(posts, res){
	var firstName = posts.toString();
	console.log("data to parse: " + posts.length);
	//open submitted.ejs after the user has submitted the form
	res.render('submitted', {output: firstName, output2: "test"});
return;
}

async function doGetRequest(urllokal) {

  let res = await axios.get(urllokal);

  let data = res.data;
//  console.log(data);
  console.log(data.data);
  return data.data
}

app.post('/', urlencodedParser, function(req, res) {
    //retrieve first and lastname

	(async()=>{
	    let result = "";
		let resultsum = ""
		let page = 1;
		let urlloop = url+page;
		console.log("urlloop " + urlloop);	
	    result = await doGetRequest(urlloop);
		resultsum = JSON.stringify(result);
		page = page + 1;
		urlloop = url+page;
		console.log("urlloop2 " + urlloop);	
	    result = await doGetRequest(urlloop);
		resultsum = resultsum + JSON.stringify(result);
	    console.log('>>>>>>>>>>> result', resultsum);
	   	parseResult(resultsum, res)
	})();

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
