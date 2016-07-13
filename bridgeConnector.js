/**
 * Created by kozervar on 2016-07-12.
 */
'use strict';
var hue = require("node-hue-api");
var HueApi = require("node-hue-api").HueApi;

function BridgeUsername(bridge, username, error){
    this.bridge = bridge;
    this.username = username;
    this.error = error;
}

function ConnectionError(message, code) {
    this.name = "ConnectionError";
    this.code = code;
    this.message = (message || "");
}

var discoverBridges = function () {
    return hue.nupnpSearch();
};

var printBridges = function(bridges) {
    if(bridges.length == 0)
        throw new ConnectionError('No HUE bridges found!', 504);
    if(bridges.length > 1)
        throw new ConnectionError('Currently only one bridge supported. Sorry!', 505);
    console.log('Bridge #', 0,': ' + JSON.stringify(bridges[0]));
    return bridges[0];
    //for (var i = 0; i < bridges.length; i++) {
    //    var bridge = bridges[i];
    //    console.log('Bridge #', i,': ' + JSON.stringify(bridge));
    //}
};

var getUsernameForBridge = function (bridge){
    return new Promise(function (resolve, reject) {
        var fs = require('fs');
        fs.readFile('./username', 'utf8', function (err, data) {
            if (err) {
                if (err.code === 'ENOENT')
                    return resolve(new BridgeUsername(bridge, '', 'ERR_MISSING_USERNAME'));
                else
                    return reject(err);
            }
            resolve(new BridgeUsername(bridge, data));
        });
    });
};

/**
 *
 * @param {BridgeUsername} bridgeUsername
 */
var handleBridge = function(bridgeUsername){
    return new Promise(function (resolve, reject) {
        if(bridgeUsername.username === '' && bridgeUsername.error === 'ERR_MISSING_USERNAME') {
            console.log('No username file found. Retrieving new username from bridge', bridgeUsername.bridge.id);
            registerUser(bridgeUsername.bridge)
                .then(function(username) {
                    bridgeUsername.username = username;
                    bridgeUsername.error = undefined;
                    return saveUsername(username);
                })
                .then(function() {
                    resolve(bridgeUsername);
                })
                .catch(function(err) {
                    console.error('Error during registering user on bridge ', bridgeUsername.bridge.id);
                    reject(err);
                })
        } else {
            resolve(bridgeUsername);
        }
    });
};

var registerUser = function (bridge) {
    return new HueApi().registerUser(bridge.ipaddress, 'My HUE bridge');
};

var saveUsername = function (username) {
    return new Promise(function (resolve, reject) {
        if (!username) reject("Username required!");
        var fs = require('fs');
        fs.writeFile("./username", username, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};


/**
 * @returns {IThenable<T>|Promise}
 */
var getConnection = function () {
    return new Promise(function (resolve, reject) {
        discoverBridges()
            .then(printBridges)
            .then(getUsernameForBridge)
            .then(handleBridge)
            .then(function(bridgeUsername){
                resolve(bridgeUsername);
            })
            .catch(function (err) {
                reject(new ConnectionError(err.message, 500));
            });
    });
};

module.exports = getConnection;