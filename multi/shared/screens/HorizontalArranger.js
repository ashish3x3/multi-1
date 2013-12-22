/* 
* To use this with require.js AND the node.js module system (on server and client side).
* see https://github.com/jrburke/amdefine
*/
if (typeof define !== 'function') { var define = require('amdefine')(module); }


define(function(require, exports, module) {

	var util = require('util');
	var screensModule = require('./index');
	var ScreenArranger = screensModule.ScreenArranger;

	/**
	 * @classdesc This class arranges the screens of the every player 
	 * horizontally. Player with lower playerNumbers will be farer left.
	 * @example
	 * --------    ------------
	 * |      |----|          |
	 * |  p1  | p2 |    p3    |
	 * |      |----|          |
	 * --------    ------------
	 * @example
	 * var arranger = new multiModule.screens.HorizontalArranger(session);
	 * var firstPlayer = session.getPlayerByNumber(0);
	 * console.log(firstPlayer.screen.x);
	 * console.log(firstPlayer.screen.y);
	 * console.log(firstPlayer.screen.width);
	 * console.log(firstPlayer.screen.height);
	 * @class
	 * @mixes module:shared/screens.ScreenArranger
	 * @memberOf module:shared/screens
	 * @param {module:client/session~Session|module:server/session~Session} 
	 *  session session instance whose player you want to be arranged.
	 */
	var HorizontalArranger = function (session) {
		ScreenArranger.call(this, session);
	};
	util.inherits(HorizontalArranger, ScreenArranger);

	HorizontalArranger.prototype.refresh = function () {
		var height = 0;
		var xPos = 0;
		var yPos;
		var lastPlayer = null;
		var players = this.session.getPlayerArray();
		players.forEach(function (player) {
			height = Math.max(height, player.height);
		});
		players.forEach(function (player) {
			yPos = Math.round((height - player.height) / 2);
			player.screen.x = xPos;
			player.screen.y = yPos;
			if (lastPlayer !== null) {
				player.screen.leftPlayers = [ lastPlayer ];
				lastPlayer.screen.rightPlayers = [ player ];
			}
			xPos += player.width;
			lastPlayer = player;
		});

		this.width = xPos;
		this.height = height;
	};

	screensModule.HorizontalArranger = HorizontalArranger;
	exports = HorizontalArranger;
	return exports;

});