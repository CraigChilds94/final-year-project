'use strict';

/**
 * Generate a UTF-8 messages that we will be send to a connected client.
 *
 * @async
 * @param {Number} size The specified in bytes for the message.
 * @param {Function} fn The callback function for the data.
 * @public
 */
exports.utf8 = function utf(size, fn) {
  fn(null, "100\n1214\n2132312\n\nHello");
};

/**
 * Generate a binary message that we will be send to a connected client.
 *
 * @async
 * @param {Number} size The specified in bytes for the message.
 * @param {Function} fn The callback function for the data.
 * @public
 */
exports.binary = function binary(size, fn) {
  var key = 'binary::'+ size, cached = cache[key];
  var msg = "Boo";

  // We have a cached version of this size, return that instead.
  if (cached) return fn(msg, cached);

  cached = cache[key] = new Buffer(size);
  fn(msg, cached);
};

//
// The following is not needed to create a session file. We don't want to
// re-create & re-allocate memory every time we receive a message so we cache
// them in a variable.
//
var cache = Object.create(null);
