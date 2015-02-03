
var path = require("path");
var fs = require('fs');

var regularify = require('../');
var browserify = require('browserify');


return browserify([path.join(__dirname, './src/index.js')])
  .transform(regularify({
    BEGIN: '{', 
    END: '}',
    rgl: ["txt"]
  }))
  .bundle()
  .on("error", function(err){
    throw err
  })
  .pipe(fs.createWriteStream( path.join(__dirname ,"./bundle.js")))

