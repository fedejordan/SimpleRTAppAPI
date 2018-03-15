//Device Token: f74f0d895a22249e75057c91e90543b5f5039cb5dd3880f9b4506b705680ceab
var device = 'f74f0d895a22249e75057c91e90543b5f5039cb5dd3880f9b4506b705680ceab';
var join = require('path').join
  , pfx = join(__dirname, '/simplertapp-certificates.p12');

// Create a new agent
var apnagent = require('apnagent')
  , agent = module.exports = new apnagent.Agent();

  // set our credentials
agent.set('pfx file', pfx);
agent.set('passphrase', 'fede123');

// our credentials were for development
agent.enable('sandbox');

agent.connect(function (err) {
  // gracefully handle auth problems
  if (err && err.name === 'GatewayAuthorizationError') {
    console.log('Authentication Error: %s', err.message);
    process.exit(1);
  }

  // handle any other err (not likely)
  else if (err) {
    throw err;
  }

  // it worked!
  var env = agent.enabled('sandbox')
    ? 'sandbox'
    : 'production';

  console.log('apnagent [%s] gateway connected', env);

  agent.createMessage()
  .device(device)
  .alert('¡Hola, soy una push notification!')
  .send();

});