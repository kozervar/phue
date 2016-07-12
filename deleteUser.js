/**
 * Created by kozervar on 2016-07-12.
 */
'use strict';
var HueApi = require("node-hue-api").HueApi;

var hostname = "192.168.1.192",
    username = "5p1ZtcD8HlUKU6u0Agx6TK9jIHpYgjnv6qamQid8";

var displayUserResult = function(result) {
    console.log("Deleted user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};

var hue = new HueApi(hostname, username);

// --------------------------
// Using a promise
hue.deleteUser("QDF-0cahT6O3Ech3Yfb0uGQqLLbzs6qv3SxbHsMu")
    .then(displayUserResult)
    .fail(displayError)
    .done();