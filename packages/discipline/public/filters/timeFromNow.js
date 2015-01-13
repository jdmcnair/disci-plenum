/*global moment:false */

'use strict';

angular.module('mean.discipline').filter('timeFromNow', function () {
    return function (date, period) {
    	var dateMoment = moment(date);
    	if(period){
    		dateMoment = dateMoment.add(period, 'seconds');
    	}

        return dateMoment.fromNow();
    };
});