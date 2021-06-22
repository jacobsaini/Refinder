const express = require('express'),
path = require('path'),
app = express();

// Serve the static files form the dist directory
app.use(express.static(__dirname + '/dist/Angular'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/Angular/index.html'));
});

//heroku default port
app.listen(process.env.PORT || 8080);