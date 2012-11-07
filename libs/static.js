// Define static routes for index.html and css/* and js/*

exports = module.exports = function(params) {
	// Requires params.app
	// 			params.baseDirectory
	
	var baseDirectory = params.baseDirectory != undefined ? params.baseDirectory : null;
	var app = params.app != undefined ? params.app : null;

	// CSS
	app.get('/css/*', function(req, res) {
		res.sendfile(baseDirectory+'/css/'+req.params[0]);
	});

	// JS
	app.get('/js/*', function(req, res) {
		res.sendfile(baseDirectory+'/js/'+req.params[0]);
	});

	// index.html
	app.get('/', function (req, res) {
	  res.sendfile(baseDirectory + '/index.html');
	});
}