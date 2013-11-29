/* global exports */

var multiModule = require('../multi/server');
var ScreenArranger = require('../multi/shared/screen').ScreenArranger;


exports.Game = function (session) {

	var snakes = [];

	function Snake (owner, display) {
		this.owner = owner;

		// start at center of display (global coords)
		var localX = Math.round(display.width / 2);
		var localY = Math.round(display.height / 2);

		this.pos = arranger.localToGlobal(display, localX, localY);

		this.move = function () {
			var getPosFunc = null;
			var dir = owner.attributes.direction || 0;
			switch (dir) {
				case 0: getPosFunc = arranger.getUp; break;
				case 1: getPosFunc = arranger.getRight; break;
				case 2: getPosFunc = arranger.getDown; break;
				case 3: getPosFunc = arranger.getLeft; break;
			}
			this.pos = getPosFunc.bind(arranger)(this.pos.x, this.pos.y, 10);
		};
	}

	function move() {
		snakes.forEach(function (snake) {
			snake.move();
			var local = arranger.globalToLocal(snake.pos.x, snake.pos.y);
			if (local !== null) {
				local.player.message('draw', {
					playerId: snake.owner.id,
					x: local.x,
					y: local.y
				});
			}
		});
	}

	function onPlayerJoined(event) {
		// TODO: cannot send messages here
		event.player.attributes.color = multiModule.color.random();
	}

	function onStartGame() {
		for (var i in session.players) {
			snakes.push(new Snake(session.players[i], session.players[i]));
		}
		setInterval(function () {
			move();
		}, 500);
		// session.message('finished');
	}

	var arranger = new ScreenArranger(session);
	session.on('playerJoined', onPlayerJoined);
	session.on('startGame', onStartGame);

};