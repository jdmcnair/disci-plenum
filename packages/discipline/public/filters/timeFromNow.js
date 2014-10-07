/*global moment:false */

'use strict';

angular.module('mean.discipline').filter('timeFromNow', function () {
    return function (date) {
        return moment(date).fromNow();
    };
});