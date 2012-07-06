/**
 * @author LinkedIn
 */
var colors    = require('colors'),
    json5     = require('json5/lib/require'),
    _         = require('underscore'),
    Config    = require('./lib/config'),
    overlord  = require('./lib/overlord'),
    executor  = require('./lib/executor'),
    i18n      = require('./lib/util/i18n'),
    locale    = require('./lib/util/locale'),
    cli       = require('./lib/util/cli'),
    logger    = require('./lib/util/logger'),
    hostname  = require('os').hostname();

/**
 * Application object
 */
function Venus() {}

/**
 * Start the App
 * @params {Array} args the command line arguments
 */
Venus.prototype.run = function(args) {
  this.commandLineArguments = args;
  this.init(args);
};

/**
 * Stop the app
 */
Venus.prototype.shutdown = function() {
  throw new Error('Not implemented');
}


/**
 * Initialize application
 * @param {Array} args the command line arguments
 */
Venus.prototype.init = function (args) {
  var command = args[2],
      flags   = cli.parseCommandLineArgs(args);

  flags.homeFolder = __dirname;

  console.log(flags);
  // Check if debug logging should be enabled
  if(flags.debug) {
    console.log('debug');
    logger.transports.console.level = logger.levels.debug;
  }

  // Set locale
  if(flags.locale) {
    locale(flags.locale);
  }

  // Execute provided command
  switch(command) {
    case 'init':
      this.initProjectDirectory();
      break;
    case 'listen':
      this.startOverlord(flags);
      break;
    case 'exec':
      this.startExecutor(flags);
      break;
    default:
      this.printUsage(flags);
      break;
  }
};

/**
 * Start in overlord mode - server which allows browsers to be captured
 */
Venus.prototype.startOverlord = function(config) {
  logger.info( i18n('Starting Overlord') );
  this.server = overlord.start(config);
};

/**
 * Start in Executor mode - run tests
 */
Venus.prototype.startExecutor = function(config) {
  logger.info( i18n('Starting in executor mode') );

  if(config.overlord === 1) {
    config.overlord = overlord.defaultUrl;
  }

  this.server = executor.start(config);
};

/**
 * Initialize new project directory
 */
Venus.prototype.initProjectDirectory = function() {

};

/**
 * Print usage
 */
Venus.prototype.printUsage = function(config) {
  var bin = _.last(this.commandLineArguments[1].split('/'));
  console.log( i18n('usage: %s %s %s', bin, '[COMMAND]', '[FLAGS]') );
  console.log( '\n\t', 'init'.yellow );
  console.log( '\t\t', i18n('Create new .venus project directory') );

  console.log( '\n\t', 'listen'.yellow);
  console.log( '\t\t', i18n('Starts the overlord') );

  console.log( '\n\t', 'exec'.yellow);
  console.log( '\t\t', i18n('Executes a test') );
};

module.exports = Venus;
