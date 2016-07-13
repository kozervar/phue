/**
 * Created by kozervar on 2016-07-13.
 */

'use strict';
var bridgeConnector = require('./bridgeConnector');

var ConnectionManager = function () {
    this.initialized = false;
};
ConnectionManager.prototype.isInitialized = function () {
    if (!this.initialized) {
        throw new Error('Connection Manager not initialized!');
    }
    return this.initialized;
};

ConnectionManager.prototype.displayResult = function (result) {
    console.log(JSON.stringify(result));
    return result;
};

ConnectionManager.prototype.displayError = function (err) {
    console.error(err);
};

ConnectionManager.prototype.setup = function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
        bridgeConnector()
            .then(_this.displayResult)
            .then(function(connection){
                _this.connection = connection;
                _this.api = new HueApi(connection.bridge.ipaddress, connection.username);
            })
            .then(_this.refreshFullState)
            .then(_this.refreshLights)
            .then(function () {
                _this.initialized = true;
                resolve(true);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

ConnectionManager.prototype.refreshFullState = function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
        _this.api.getFullState()
            .then(_this.displayResult)
            .then(function (fullState) {
                _this.fullState = fullState;
                resolve(_this.fullState);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

ConnectionManager.prototype.refreshLights = function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
        _this.api.lights()
            .then(_this.displayResult)
            .then(function (lights) {
                _this.lights = lights.lights;
                resolve(_this.lights);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

module.exports = ConnectionManager;