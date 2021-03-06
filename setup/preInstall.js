// @author LinkedIn 

// Pre install checks when running npm install for Venus  
  
var sys  = require('util'),
    exec = require('child_process').exec;

// Check to make sure PhantomJS 1.6.0 is installed (see http://phantomjs.org/)  
exec('phantomjs --version', function(error, stdout, stderr) {
  if(stdout.indexOf( 'not found' ) === -1) {
    sys.puts('PhantomJS is installed -- good to go.');
  } else {
    sys.puts('Could not find PhantomJS -- please install before continuing.');
  }
});

