const moment = require('moment');

const TIME_ORIGIN = moment('2017-01-01');
const SUMMER_SOLSTICE = moment('2017-12-21');
const WINTER_SOLSTICE = moment('2017-06-21');
const VERNAL_EQUINOX = moment('2017-03-20');
const AUTUM_EQUINOX = moment('2017-09-22');
const EARTH_ROTATION_RATE = 360/365;
const EARTH_TILT = 23.6;
const LATITUDE = -34.36;
const LONGITUDE =  -58.26



function getDayDiff(date){
	const TIME_ORIGIN = moment('2017-01-01');
	return date.diff(TIME_ORIGIN, 'days');
}

exports.oldec = function(){
	console.log(getDayDiff(SUMMER_SOLSTICE));
	return Math.cos(( (getDayDiff(SUMMER_SOLSTICE) + 10) * EARTH_ROTATION_RATE) * Math.PI / 180) * EARTH_TILT;
}

exports.declination = function(date){

	var n = getDayDiff(date);

	console.log('N ' + n);

	a = 23.45 * (Math.PI/180);

	b = (2*Math.PI);

	c = (284+n) / 36.25;

	console.log(a, b, c);

	return a * Math.sin( b * c ) * (180/Math.PI);
}