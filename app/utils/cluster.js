
var	cluster = require('cluster'),
	net = require('net'),

	farmhash = require('farmhash');

var port = 3011,
	num_processes = require('os').cpus().length;
var app = ""
if (cluster.isMaster) {
	// This stores our workers. We need to keep them to be able to reference
	// them based on source IP address. It's also useful for auto-restart,
	// for example.
	var workers = [];

	// Helper function for spawning worker at index 'i'.
	var spawn = function (i) {
		workers[i] = cluster.fork();

		// Optional: Restart worker on exit
		workers[i].on('exit', function (code, signal) {
			console.log('respawning worker', i);
			spawn(i);
		});
	};

	// Spawn workers.
	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}

	// Helper function for getting a worker index based on IP address.
	// This is a hot path so it should be really fast. The way it works
	// is by converting the IP address to a number by removing non numeric
	// characters, then compressing it to the number of slots we have.
	//
	// Compared against "real" hashing (from the sticky-session code) and
	// "real" IP number conversion, this function is on par in terms of
	// worker index distribution only much faster.
	var worker_index = function (ip, len) {
		return farmhash.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
	};

	// Create the outside facing server listening on our port.
	var server = net.createServer({ pauseOnConnect: true }, function (connection) {
		// We received a connection and need to pass it to the appropriate
		// worker. Get the worker for this connection's source IP and pass
		// it the connection.
		var worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	}).listen(port);
} else {
	// Note we don't use a port here because the master listens on it for us.
	app = require('./app')

	// Here you might use middleware, attach routes, etc.

	// Don't expose our internal server to the outside.


	// Tell Socket.IO to use the redis adapter. By default, the redis
	// server is assumed to be on localhost:6379. You don't have to
	// specify them explicitly unless you want to change them.

}
