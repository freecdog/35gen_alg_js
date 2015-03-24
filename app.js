
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
    res.send("asd");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var GA = require('./routes/genalg.js').GA;

var ga_options = {
    ga_layers_count: 1,
    ga_persons_count: 1000,
    ga_diaps_start: [-5],
    ga_diaps_finish: [5],
    ga_mutation_percent: 0.7,
    ga_mutation_type: 2,
    ga_current_function: 0,
    ga_func_count: 3,
    ga_sort_percent: 0.5,
    ga_sort_type: 1,
    ga_researchcenter_mode: 1,
    ga_researchcenter_value: 0
};

var ga2 = new GA(ga_options);

var iasdgagasgasdfgasdg = 0;
