const moment = require('moment');

/**
 *	Sunrise/sunset script. By Matt Kane. 
 * 
 *  Based loosely and indirectly on Kevin Boone's SunTimes Java implementation 
 *  of the US Naval Observatory's algorithm.
 * 
 *  Copyright © 2012 Triggertrap Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General
 * Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful,but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 * You should have received a copy of the GNU Lesser General Public License along with this library; if not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA,
 * or connect to: http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 */

/*
Date.prototype.sunrise = function(latitude, longitude, zenith) {
	return this.sunriseSet(latitude, longitude, true, zenith);
}

Date.prototype.sunset = function(latitude, longitude, zenith) {
	return this.sunriseSet(latitude, longitude, false, zenith);
}

Date.prototype.sunriseSet = function(latitude, longitude, sunrise, zenith) {
	if(!zenith) {
		zenith = 90.8333;
	}


	var hoursFromMeridian = longitude / Date.DEGREES_PER_HOUR,
		dayOfYear = this.getDayOfYear(),
		approxTimeOfEventInDays,
		sunMeanAnomaly,
		sunTrueLongitude,
		ascension,
		rightAscension,
		lQuadrant,
		raQuadrant,
		sinDec,
		cosDec,
		localHourAngle,
		localHour,
		localMeanTime,
		time;

	if (sunrise) {
        approxTimeOfEventInDays = dayOfYear + ((6 - hoursFromMeridian) / 24);
    } else {
        approxTimeOfEventInDays = dayOfYear + ((18.0 - hoursFromMeridian) / 24);
    }

	sunMeanAnomaly = (0.9856 * approxTimeOfEventInDays) - 3.289;

	sunTrueLongitude = sunMeanAnomaly + (1.916 * Math.sinDeg(sunMeanAnomaly)) + (0.020 * Math.sinDeg(2 * sunMeanAnomaly)) + 282.634;
	sunTrueLongitude =  Math.mod(sunTrueLongitude, 360);

	ascension = 0.91764 * Math.tanDeg(sunTrueLongitude);
    rightAscension = 360 / (2 * Math.PI) * Math.atan(ascension);
    rightAscension = Math.mod(rightAscension, 360);
    
    lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
    raQuadrant = Math.floor(rightAscension / 90) * 90;
    rightAscension = rightAscension + (lQuadrant - raQuadrant);
    rightAscension /= Date.DEGREES_PER_HOUR;

    sinDec = 0.39782 * Math.sinDeg(sunTrueLongitude);
	cosDec = Math.cosDeg(Math.asinDeg(sinDec));
	cosLocalHourAngle = ((Math.cosDeg(zenith)) - (sinDec * (Math.sinDeg(latitude)))) / (cosDec * (Math.cosDeg(latitude)));

	localHourAngle = Math.acosDeg(cosLocalHourAngle)

	if (sunrise) {
		localHourAngle = 360 - localHourAngle;
	} 

	localHour = localHourAngle / Date.DEGREES_PER_HOUR;

	localMeanTime = localHour + rightAscension - (0.06571 * approxTimeOfEventInDays) - 6.622;

	time = localMeanTime - (longitude / Date.DEGREES_PER_HOUR);
	time = Math.mod(time, 24);

	var midnight = new Date(0);
		midnight.setUTCFullYear(this.getUTCFullYear());
		midnight.setUTCMonth(this.getUTCMonth());
		midnight.setUTCDate(this.getUTCDate());
	


	var milli = midnight.getTime() + (time * 60 *60 * 1000);


	return new Date(milli);
}

Date.DEGREES_PER_HOUR = 360 / 24;


// Utility functions

Date.prototype.getDayOfYear = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
}

Math.degToRad = function(num) {
	return num * Math.PI / 180;
}

Math.radToDeg = function(radians){
    return radians * 180.0 / Math.PI;
}

Math.sinDeg = function(deg) {
    return Math.sin(deg * 2.0 * Math.PI / 360.0);
}


Math.acosDeg = function(x) {
    return Math.acos(x) * 360.0 / (2 * Math.PI);
}

Math.asinDeg = function(x) {
    return Math.asin(x) * 360.0 / (2 * Math.PI);
}


Math.tanDeg = function(deg) {
    return Math.tan(deg * 2.0 * Math.PI / 360.0);
}

Math.cosDeg = function(deg) {
    return Math.cos(deg * 2.0 * Math.PI / 360.0);
}

Math.mod = function(a, b) {
	var result = a % b;
	if(result < 0) {
		result += b;
	}
	return result;
}

*/


const TIME_ORIGIN = moment('2017-01-01');

const EARTH_ROTATION_RATE = 360/365;
const EARTH_TILT = 23.6;
const LATITUDE = 0;
const LONGITUDE =  -58.26;

function daydiff(date){
	return date.diff(TIME_ORIGIN, 'days') + 1;
}

function roughDeclination(date){
	return Math.cos(( (daydiff(date) + 10) * EARTH_ROTATION_RATE) * Math.PI / 180) * EARTH_TILT;
}

function rad(angle){
	return angle * (Math.PI / 180);
}

function deg(angle){
	return angle * (180/Math.PI);
}

function hourToMin(h){
	return h*60;
}

function decToHour(num) {
    return ('0' + Math.floor(num) % 24).slice(-2) + ':' + ((num % 1)*60 + '0').slice(0, 2);
}

// lib
function hourAngle(hour)
{
	return ((hour * 60) - 720) / 4; //4 min/deg solar rotation rate
}

function declination(date){
	var days = daydiff(date);
	return 23.45 * Math.sin( rad( ((days + 284)/365)*360) );
}

function timeEquation(date){
	var days = daydiff(date);

	function D(days){
		return 360 * ((days - 81) / 365 );
	}
	
	D = D(days);

	return (9.87 * Math.sin(rad(D*2))) - (7.53 * Math.cos(rad(D))) - ( 1.5 * Math.sin(rad(D))); 
}

function localStandardMeridian(lon){
	return 15 * Math.round(lon / 15);
}

function apparentSolarTime(date, localStandardTime, lon){

	// convert to min
	var lst = hourToMin(localStandardTime);
	var lsm = localStandardMeridian(lon);
	var et = parseFloat(timeEquation(date).toFixed(2));  
	var ast = lst + (4 * (lsm - lon)) + et;
	return ast/60;
}

// \lib

function altitude(dec, lat, ha){

	var lat = rad(lat);
	var dec = rad(dec);
	var ha = rad(ha);
	return Math.asin(Math.cos(lat) * Math.cos(dec) * Math.cos(ha) + (Math.sin(lat) * Math.sin(dec)));
}


exports.altitude = function(date, hour){
	var ast = apparentSolarTime(date, hour, LONGITUDE);
	var ha = hourAngle(ast);
	var dec = declination(date);

	return deg(altitude(dec, LATITUDE, ha));
}

