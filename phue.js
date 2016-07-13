/**
 * Created by kozervar on 2016-07-12.
 */
'use strict';
var CONFIG = require('./config/config');
var ConnectionManager = require('./connectionManager');
var connectionManager = new ConnectionManager();

var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: CONFIG.HUE.cron.loop,
    onTick: function() {
        connectionManager.setup()
            .then(function(){
                console.log('HUE bridge connection setup successful!')
            })
            .catch(function(err){
                console.error(err);
            });
    }
});
job.start();
//var bridgeConnector = require('./bridgeConnector');
//var hue = require("node-hue-api");
//var HueApi = require("node-hue-api").HueApi;
//
//var API;
//
//var lightState = hue.lightState;
//
//var displayResult = function(result) {
//    console.log(JSON.stringify(result));
//    return result;
//};
//
//var displayError = function (err) {
//    console.error(err);
//};
//
//var printConnection = function (connection) {
//    console.log(JSON.stringify(connection));
//    return connection;
//};
//
//var getFullState = function (connection){
//    API = new HueApi(connection.bridge.ipaddress, connection.username);
//    return API.getFullState()
//};
//
//var connection = bridgeConnector();
//connection
//    .then(printConnection)
//    .then(getFullState)
//    .then(displayResult)
//    .catch(displayError);
//.then(function (connection) {
//    var l1On = lightState.create().on();
//    var l1Off = lightState.create().off();
//    var api = new HueApi(connection.bridge.ipaddress, connection.username);
//    api.config().then(displayResult).done();
//
//    var lastState = false;
//    setInterval(function(){
//        if(lastState) {
//            api.setLightState(1, l1Off).done();
//            lastState = false;
//        } else {
//            api.setLightState(1, l1On).done();
//            lastState = true;
//        }
//    }, 100);
//})
