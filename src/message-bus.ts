'use strict';

import postal = require('postal');

// const postalReqRes = require('postal.request-response');

// const bus = postalReqRes(postal);

// bus.configuration.promise.createDeferred = function createDeferred() {
//   const deferred: any = {};
//   deferred.promise = new Promise((resolve, reject) => {
//     deferred.resolve = resolve;
//     deferred.reject = reject;
//   });
//   return deferred;
// };

// bus.configuration.promise.getPromise = function getPromise(deferred: any) {
//   return deferred.promise;
// };

export const eventChannel = postal.channel('/game/events');
export const queryChannel = postal.channel('/game/queries');
export const commandChannel = postal.channel('/game/commands');
export const clientEventChannel = postal.channel('/client/events');
export const clientCommandChannel = postal.channel('/client/commands');
