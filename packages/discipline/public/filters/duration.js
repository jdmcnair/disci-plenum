/*global moment:false */

'use strict';

angular.module('mean.discipline').filter('duration', function () {
    return function (input) {
        return moment.duration(input, 'seconds').format();
    };
});