const dec = require('./declination');
const moment = require('moment');

const SUMMER_SOLSTICE = moment('2017-9-21');
const WINTER_SOLSTICE = moment('2017-06-21');
const VERNAL_EQUINOX = moment('2017-03-20');
const AUTUM_EQUINOX = moment('2017-09-22');

module.exports = function(measures){

	this._width = measures.width;
	this._diameter = measures.diameter;
	this._radius = this._diameter / 2;

	this.width = function(){
		return this._width;
	}

	this.radius = function(){
		return this._radius;
	}

	this.diameter = function(){
		return this._diameter;
	}

	this.length = function(){
		return this._diameter * Math.PI;
	}

	this.radianArcRadianLength = function(angle){
		return this.radius() * angle;
	}

	this.degreeArcRadianLength = function(angle){
		return this.radianArcRadianLength(angle * (Math.PI / 180));
	}

	this.radianArcDegreeLength = function(angle){
		return this.radianArcRadianLength(angle * (180 / Math.PI));
	}

	this.drawOpen = function(view, x, y){
	
		this.drawGrid(view, x, y);	
		this.drawDots(view, x, y);
	}

	this.drawGrid = function(view, x,y){

		var w = this.width() * view.factor();
		var l = this.length() * view.factor();

		// outline
		view.ctx().rect(x, y, w, this.length() * view.factor());
		view.ctx().stroke();
		
		// grid
		var angles = [45, 90, 135, 180, 225];
		var anglesY = [];

		// convert angles to length
		for(a in angles){
			anglesY.push(this.degreeArcRadianLength(angles[a]) * view.factor());
		}			
		
		for(h in anglesY){
			view.ctx().beginPath();
			view.ctx().moveTo(x, y + anglesY[h]);
		    view.ctx().lineTo(x + w, y + anglesY[h]);
		    view.ctx().stroke();
		}

		// summer solstice line
		view.ctx().beginPath();
		view.ctx().moveTo(x + 20, y + anglesY[0]);
	    view.ctx().lineTo(x + 20, y + anglesY[4]);
	    view.ctx().strokeStyle = '#0099ff';
	    view.ctx().stroke();

		// equinox line
		view.ctx().beginPath();
		view.ctx().moveTo(x + (w / 2), y + anglesY[0]);
	    view.ctx().lineTo(x + (w / 2), y + anglesY[4]);
	    view.ctx().stroke();
		
		// winter solstice line
		view.ctx().beginPath();
		view.ctx().moveTo(x + w - 20, y + anglesY[0]);
	    view.ctx().lineTo(x + w - 20, y + anglesY[4]);
	    view.ctx().stroke();
	}

	this.drawCurveThroughNPoints = function(view, points){

		var restore = view.ctx().lineWidth;

		view.ctx().beginPath();
		view.ctx().lineWidth = 2;
		view.ctx().strokeStyle = 'blue';

		// move to the first point
		view.ctx().moveTo(points[0].x, points[0].y);

	   for (i = 1; i < points.length - 1; i ++)
	   {  		
			var xc = (points[i].x + points[i + 1].x) / 2;
			var yc = (points[i].y + points[i + 1].y) / 2;
			view.ctx().quadraticCurveTo(points[i].x, points[i].y, xc, yc);
	   		
	   }
	   
		// curve through the last two points
		view.ctx().quadraticCurveTo(points[i].x, points[i].y, points[i].x,points[i].y);
		view.ctx().stroke();
		view.ctx().lineWidth = restore;
		view.ctx().closePath();
	}

	this.drawDots = function(view, x, y){

		var dotsize = 3;
		var w = this.width() * view.factor();
		var o = this.degreeArcRadianLength(45) * view.factor();
		var hours = [6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0];

		for(s in hours){

			var curve = [];
			view.ctx().lineWidth = 0;

			// summer solstice noon
			var alt = dec.altitude(SUMMER_SOLSTICE, hours[s]);
			h = o + y + (this.degreeArcRadianLength(alt * 2) * view.factor());

			view.ctx().beginPath();
			view.ctx().arc(x + w - 20, h, dotsize, 0, 2 * Math.PI, false);
		    view.ctx().fillStyle = 'gold';
		    view.ctx().fill();
		    view.ctx().closePath();

		    curve.push({x: x + w - 20, y: h})
		
		    // vernal equinox noon
			var alt = dec.altitude(VERNAL_EQUINOX, hours[s]);
			h = o + y + (this.degreeArcRadianLength(alt * 2) * view.factor());

			view.ctx().beginPath();
			view.ctx().arc(x + (w / 2), h, dotsize, 0, 2 * Math.PI, false);
		    view.ctx().fillStyle = 'gold';
		    view.ctx().fill();
		    view.ctx().closePath();

		    curve.push({x: x + (w / 2), y: h})

		    // winter solstice noon
			var alt = dec.altitude(WINTER_SOLSTICE, hours[s]);
			h = o + y + (this.degreeArcRadianLength(alt * 2) * view.factor());

			view.ctx().beginPath();
			view.ctx().arc(x + 20, h, dotsize, 0, 2 * Math.PI, false);
		    view.ctx().fillStyle = 'gold';
		    view.ctx().fill();
		    view.ctx().closePath();

		    curve.push({x: x + 20, y: h});

		    this.drawCurveThroughNPoints(view, curve);
			
		}	

	}

	this.drawClosed = function(view, x, y){
		
		// outline
		view.ctx().beginPath();
		view.ctx().arc(x, y, this.radius() * view.factor(), 0, 2*Math.PI);
		view.ctx().stroke();

		
	}

}