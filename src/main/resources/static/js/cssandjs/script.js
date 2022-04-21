var userName;

var HoverSound = new Audio("http://192.168.18.101:8080/sounds/buttonHover.wav")
var ClickSound = new Audio("http://192.168.18.101:8080/sounds/click.wav")
var audio = new Audio("http://192.168.18.101:8080/sounds/menuSong.mp3");
var startSound = new Audio("http://192.168.18.101:8080/sounds/countdown.mp3")
var TypSound = new Audio("http://192.168.18.101:8080/sounds/typSound.mp3")
var waiting = ["http://192.168.18.101:8080/sounds/waiting.mp3"]
//, "https://sndup.net/v2q7/d", "https://sndup.net/tr74/d", "https://sndup.net/frnp/d", "https://sndup.net/q48s/d", "https://sndup.net/k585/d"
var waitingSound = new Audio(waiting[Math.floor(Math.random()*waiting.length)])
var winner;
var stompClient = null;
var Ids = [];
var audioEx = new Audio("http://192.168.18.101:8080/sounds/explosie.wav")
var imageChoice = null;
var imageChoiceBullet = null;
var Planes = [];
var Bullets = [];
var id;
var maxHeight;
var maxWidth;
var player;
var imgBull;
class Plane {
	width;
	height;
	imgPlane;
	imgFlames;
	name;
	boostDur = 60;
	boostInter;
	boostInterval;
	saved_moves = "";
	speed = 6.0;
	planeTop;
	planeLeft;
	audioShoot = new Audio("http://192.168.18.101:8080/sounds/Blast.mp3");
	audioBoost = new Audio("http://192.168.18.101:8080/sounds/boost.mp3");
	soundShoot = false;
	executed = false;
	nickname;
	levens = 50;
	constructor(width, height, imgPlane, imgFlames, name, planeTop, planeLeft) {
		this.width = width;
		this.height = height;
		this.imgPlane = imgPlane;
		this.imgFlames = imgFlames;
		this.name = name;
		this.planeTop = planeTop;
		this.planeLeft = planeLeft;
	}
	makePlane() {
		var div = document.createElement("div")
		div.style.position = "relative";
		div.style.width = 100 + "px";
		div.style.height = 100 + "px";
		div.style.top = this.planeTop + "%"
		div.style.left = this.planeLeft + "%";
		div.setAttribute("id", this.name)
		div.style.zIndex = "1"
		div.style.transformOrigin = "center";
		var plane = document.createElement("img")
		plane.style.width = 90 + "%";
		plane.style.height = 70 + "%";
		plane.src = this.imgPlane
		plane.setAttribute("id", this.name + "P")
		plane.style.position = "absolute";
		plane.style.zIndex = "2"
		div.append(plane)
		var flames = document.createElement("img")
		flames.style.width = 90 + "%";
		flames.style.height = 100 + "%";
		flames.setAttribute("id", this.name + "F")
		flames.src = this.imgFlames;
		flames.style.position = "absolute";
		flames.style.zIndex = "3"
		div.append(flames)
		document.getElementById("container").append(div)
		var div1 = document.createElement("div")
		var text = document.createElement("span");
		text.setAttribute("id", this.name + "text")
		if (userName != "") {
			var speler = player.split("r", 2)[1];
			var planeId = this.name.split("e", 2)[1];
			if (speler === planeId) {
				var textnode = document.createTextNode(userName)
				console.log(userName)
				text.appendChild(textnode)
			}
		} else {
			var textnode = document.createTextNode(this.name)
			text.appendChild(textnode)
		}
		div1.append(text)
		div1.style.zIndex = "3";
		div1.setAttribute("class", "textName")
		div.append(div1)
	}
	boostDown() {
		var plane = document.getElementById(this.name + "P")
		var flames = document.getElementById(this.name + "F")
		var boost = document.getElementById("boost")
		if (!this.executed) {
			clearInterval(this.boostInter)
			this.executed = true;
			if (!this.boostDur <= 0) {
				this.speed = 10.0;
				plane.style.width = 90 + "%";
				plane.style.height = 70 + "%";
				flames.style.width = 90 + "%";
				flames.style.height = 100 + "%";
				flames.src = "https://i.ibb.co/xj6XdgW/flames3.gif";
				this.audioBoost.volume = 0.9;
				this.audioBoost.play();
				this.boostInterval = setInterval(function(plane) {
					return function() {
						if (plane.boostDur <= 0) {
							clearInterval(plane.boostInterval)
							Planes.find(o => o.name === plane.name).boostUp();
							Keys.ctrl = false;
						} else {
							plane.boostDur = plane.boostDur - 2.50;
							boost.value = plane.boostDur
							boost.style.background = `linear-gradient(to right, lime 0%, lime ${(boost.value - boost.min) / (boost.max - boost.min) * 100}%, black ${(boost.value - boost.min) / (boost.max - boost.min) * 100}%, black 100%)`
						}
					};
				}(this), 250)
			}
		}
	}
	boostUp() {
		if (this.executed) {
			this.executed = false;
			if (this.name === "plane1") {
				stompClient.send("/app/plane/boost/1", {}, "false")
			}
			if (this.name === "plane2") {
				stompClient.send("/app/plane/boost/2", {}, "false")
			}
			var boost = document.getElementById("boost")
			var flames = document.getElementById(this.name + "F")
			var plane = document.getElementById(this.name + "P")
			this.speed = 6.0;
			this.audioBoost.pause();
			this.audioBoost.currentTime = 0;
			plane.style.height = 70 + "%";
			flames.src = this.imgFlames;
			this.boostInter = setInterval(function(plane) {
				return function() {
					if (plane.boostDur >= 60) {
						plane.boostDur = 60;
						clearInterval(plane.boostInter)
					}
					plane.boostDur = plane.boostDur + 2.50;
					boost.value = plane.boostDur
					boost.style.background = `linear-gradient(to right, lime 0%, lime ${(boost.value - boost.min) / (boost.max - boost.min) * 100}%, black ${(boost.value - boost.min) / (boost.max - boost.min) * 100}%, black 100%)`
				};
			}(this), 500)
		}
	}
	Move() {
		var plane = document.getElementById(this.name)
		var rect = plane.getBoundingClientRect();
		this.saved_moves = document.getElementById(this.name).style.transform;
		var move = "";
		if (Keys.up) {
			if (rect.top <= 0) {
				plane.style.top = parseInt(plane.style.top) + 1 + "%"
			}
			if (rect.bottom >= maxHeight) {
				plane.style.top = parseInt(plane.style.top) - 1 + "%"
			}
			if (rect.left <= 0) {
				plane.style.left = parseInt(plane.style.left) + 1 + "%"
			}
			if (rect.right >= maxWidth) {
				plane.style.left = parseInt(plane.style.left) - 1 + "%"
			} else {
				//				plane.style.transform += 'translateZ( -' + Math.round(this.speed) / 10 + 'vh )';
				move = move + ' translateY( -' + Math.round(this.speed) / 10 + 'vh )'
			}
		}
		if (Keys.right) {
			//			plane.style.transform += 'rotate( 3deg )';
			move = move + ' rotate( 3deg )'
		} else if (Keys.left) {
			//			plane.style.transform += 'rotate( -3deg )';
			move = move + ' rotate( -3deg )'
		}
		if (Keys.ctrl) {
			if (!Planes.find(o => o.name === this.name).executed) {
				Planes.find(o => o.name === this.name).boostDown()
				if (this.name === "plane1") {
					var array = {
						"waarde": "true",
						"id": id
					}
					stompClient.send("/app/plane/boost/1", {}, JSON.stringify(array))
				}
				if (this.name === "plane2") {
					var array = {
						"waarde": "true",
						"id": id
					}
					stompClient.send("/app/plane/boost/2", {}, JSON.stringify(array))
				}
			}
		}
		if (!Keys.ctrl) {
			if (Planes.find(o => o.name === this.name).executed) {
				clearInterval(Planes.find(o => o.name === this.name).boostInterval)
				Planes.find(o => o.name === this.name).boostUp()
				if (this.name === "plane1") {
					var array = {
						"waarde": "false",
						"id": id
					}
					stompClient.send("/app/plane/boost/1", {}, JSON.stringify(array))
				}
				if (this.name === "plane2") {
					var array = {
						"waarde": "false",
						"id": id
					}
					stompClient.send("/app/plane/boost/2", {}, JSON.stringify(array))
				}
			}
		}
		if (Keys.shift) {
			if (this.name === "plane1") {
				Planes.find(o => o.name === this.name).Fire(player);
				var array = {
					"waarde": "true",
					"id": id
				}
				stompClient.send("/app/plane/shoot/1", {}, JSON.stringify(array))
				if (this.soundShoot) {
					this.audioShoot.pause();
					this.audioShoot.currentTime = 0;
					this.soundShoot = false;
				}
				this.audioShoot.volume = 0.9;
				this.audioShoot.play();
				this.soundShoot = true;
				console.log("geschoten player 1")
				Keys.shift = false;
			}
			if (this.name === "plane2") {
				Planes.find(o => o.name === this.name).Fire(player);
				var array = {
					"waarde": "true",
					"id": id
				}
				stompClient.send("/app/plane/shoot/2", {}, JSON.stringify(array))
				if (this.soundShoot) {
					this.audioShoot.pause();
					this.audioShoot.currentTime = 0;
					this.soundShoot = false;
				}

				this.audioShoot.volume = 0.9;
				this.audioShoot.play();
				this.soundShoot = true;
				console.log("geschoten player 2")
				Keys.shift = false;
			}

		}
		var x = parseInt(document.getElementById(this.name).style.left);
		var y = parseInt(document.getElementById(this.name).style.top);
		this.saved_moves += move;

		if (move != "") {
			if (this.name === "plane1") {
				var coords = {
					"x": x,
					"y": y,
					"transform": move,
					"id": id
				}
				stompClient.send("/app/plane/move1", {}, JSON.stringify(coords));
			}
			if (this.name === "plane2") {
				var coords = {
					"x": x,
					"y": y,
					"transform": move,
					"id": id
				}
				stompClient.send("/app/plane/move2", {}, JSON.stringify(coords));
			}
		}
		plane.style.transform += move;
		var animation = requestAnimationFrame(function(plane) {
			return function() {
				Planes.find(o => o.name === plane.name).Move()
			};
		}(this));

	}
	Fire(speler) {
		if (imageChoiceBullet == null) {
			var bullet = new Bullet(20, 20, "https://i.ibb.co/8zTJrZC/bullet.png", this.name)
			Bullets.push(bullet);
		} else {
			var bullet = new Bullet(20, 20, imageChoiceBullet, this.name)
			Bullets.push(bullet);
		}
		if (player === speler) {
			Bullets.find(o => o.origin === this.name).makeBullet(this, speler)
		} else {
			Bullets.find(o => o.origin === this.name).makeBullet(this, speler)
		}

	}
}
class Bullet {
	width;
	height;
	img;
	origin;
	backupImg = "https://i.ibb.co/8zTJrZC/bullet.png";
	constructor(width, height, img, origin) {
		this.width = width;
		this.height = height;
		this.img = img;
		this.origin = origin;

	}
	makeBullet(plane, speler) {
		var trany = 0;
		var saved = Planes.find(o => o.name === plane.name).saved_moves;
		var planeId = plane.name.substring(5, 6)
		var bullet = document.createElement("img")
		if(player != null){
		if (planeId === player.split("r", 2)[1]) {
			bullet.src = this.img;
		}
		if (planeId != player.split("r", 2)[1]) {
			if (imgBull == null) {
				bullet.src = this.backupImg;
			}
			if (imgBull != null) {
				bullet.src = imgBull;
			}
		}
		}
		bullet.style.position = "absolute";
		bullet.style.width = this.width + "px";
		bullet.style.height = this.height + "px";
		bullet.setAttribute("class", "bullet" + planeId)
		bullet.setAttribute("id", "bullet" + planeId)
		bullet.style.zIndex = "0"
		if (plane.name === "plane1") {
			bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 4 + "%";
		} else {
			bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 20 + "%";
		}
		bullet.style.left = parseInt(document.getElementById(plane.name).style.left) + 4 + "%"
		bullet.style.transform = saved;
		document.getElementById("container").append(bullet)
		var inter = setInterval(function(plane) {
			return function() {
				trany -= 7;
				bullet.style.transform = saved + 'translateY(' + trany + 'vmin)';
				var bullets = document.getElementsByClassName("bullet" + planeId)
				for (var i = 0; i < bullets.length; i++) {
					const bounding = bullets[i].getBoundingClientRect();
					if (plane.name === "plane1") {
						var vliegtuig = document.getElementById("plane2").getBoundingClientRect();
						var rakenPlane = checkCollision(bounding, vliegtuig);
						if (rakenPlane) {
							if (player === "player2") {
								plane.levens--;
								if (plane.levens === 0) {
									plane.levens = 0;
									if (Planes.find(o => o.name === "plane1").nickname != null) {
										winner = Planes.find(o => o.name === "plane1").nickname
									} else {
										winner = plane.name;
									}
									var array = {
										"player": player,
										"winner": winner,
										"waarde": "true"
									}
									stompClient.send("/app/plane/won", {}, JSON.stringify(array));
								}
								var perc = parseDecimal(plane.levens * 2)
								document.getElementById("score").style.color = getColorForPercentage(perc)
								document.getElementById("score").innerHTML = plane.levens;
							}
							document.getElementById("container").removeChild(bullets[i])
							explosion(speler)
							clearInterval(inter)
							trany = 0;
						}
					}
					if (plane.name === "plane2") {
						var vliegtuig = document.getElementById("plane1").getBoundingClientRect();
						var rakenPlane = checkCollision(bounding, vliegtuig);
						if (rakenPlane) {
							if (player === "player1") {
								plane.levens--;
								if (plane.levens === 0) {
									plane.levens = 0;
									if (Planes.find(o => o.name === "plane2").nickname != null) {
										winner = Planes.find(o => o.name === "plane2").nickname
									} else {
										winner = plane.name;
									}
									var array = {
										"player": player,
										"winner": winner,
										"waarde": "true"
									}
									stompClient.send("/app/plane/won", {}, JSON.stringify(array));
								}
								var perc = parseDecimal(plane.levens * 2)
								document.getElementById("score").style.color = getColorForPercentage(perc)
								document.getElementById("score").innerHTML = plane.levens;
							}
							document.getElementById("container").removeChild(bullets[i])
							explosion(speler)
							clearInterval(inter)
							trany = 0;
						}
					}
					if (bounding.top < 0 || bounding.left < 0 || bounding.bottom > maxHeight || bounding.right > maxWidth) {
						clearInterval(inter)
						document.getElementById("container").removeChild(bullets[i])
						trany = 0;
					}
				}
			}
		}(plane), 40)
	}
}

function connect() {
	var socket = new SockJS('http://192.168.18.101:8080/websocket', [], {
		sessionId: () => {
			var connid = getRandom()
			sessionId = connid;
			maxHeight = (window.innerHeight || document.documentElement.clientHeight);
			maxWidth = (window.innerWidth || document.documentElement.clientWidth);
			return sessionId
		}
	});
	var username = document.getElementById("input").value;
	userName = username;
	stompClient = Stomp.over(socket);
	stompClient.debug = null;
	stompClient.connect('', '', function() {
		var sesid = socket._transport.url.split("/", 6)[5]
		id = sesid;
		stompClient.send('/app/plane/name', {}, id)
		stompClient.subscribe('/plane/name/test', function(message) {
			var value = message.body;
			if (player == null) {
				if (value === "1") {
					player = "player1";
					console.log("Player1")
					document.getElementsByClassName("loading")[0].style.display = "block"
					document.getElementById("HoofdContainer").style.display = "none"
					waitingSound.play();
					audio.pause();
				} else {
					player = "player2"
					console.log("Player2")
				}
				sendImage();
				makePlane();
				document.getElementById('plane1').style.display = "none"
				document.getElementById('plane2').style.display = "none"
			}
			if (player != null || player == null) {
				if (value === "2") {
					document.getElementsByClassName("loading")[0].style.display = "none"
					waitingSound.pause()
					audio.pause();
					console.log("test player")
					var countdown1 = document.getElementById('countdown')
					countdown1.style.display = "block"
					document.getElementById("HoofdContainer").style.display = "none"
					startSound.play();
					var countD = 4;
					var inter = setInterval(function() {
						countD--
						countdown1.innerHTML = "Game starts in " + countD;
					}, 1000)
					setTimeout(function() {
						clearInterval(inter)
						setConnected("none");
						document.getElementById('plane2').style.display = "block"
						document.getElementById('plane1').style.display = "block"
						countdown1.style.display = "none"
						var theme = new Audio("http://192.168.18.101:8080/sounds/BattleThemeSong.mp3");
						theme.volume = 0.2;
						theme.loop = true;
						theme.play();
						requestAnimationFrame(function() {
							update()
						})


					}, 4000)
				}

			}

		})

		stompClient.subscribe('/plane/image/settings', function(message) {
			var array = JSON.parse(message.body);

			for (var i = 0; i < array.length; i++) {
				var speler;
				if (array[i].player != player) {
					if(array[i].player != null){
					speler = array[i].player.split("r", 2)[1]
					}
					if (array[i].username != "") {
						document.getElementById("plane" + speler + "text").textContent = array[i].username
						Planes.find(o => o.name === "plane" + speler).nickname = array[i].username;

					}
					if (array[i].img != null) {
						document.getElementById("plane" + speler + "P").src = array[i].img;
					}
					if (array[i].imgBul != null) {
						imgBull = array[i].imgBul;
					}
				} else {
					var speler;
					if(array[i].player != null){
					speler = array[i].player.split("r", 2)[1]
					}
					if (array[i].username != "") {
						document.getElementById("plane" + speler + "text").textContent = array[i].username
						Planes.find(o => o.name === "plane" + speler).nickname = array[i].username;
					}
					if (array[i].img != null) {
						document.getElementById("plane" + speler + "P").src = array[i].img;
					}

				}
			}
		})
		//plane1 move
		stompClient.subscribe('/plane/coords', function(message) {
			var coords = JSON.parse(message.body)
			if (coords.id != id) {
				client2 = coords.id
				if (coords.y != null && coords.x != null) {
					document.getElementById("plane1").style.top = coords.y + "%"
					document.getElementById("plane1").style.left = coords.x + "%"

				}

				document.getElementById("plane1").style.transform += coords.transform
				Planes.find(o => o.name === "plane1").saved_moves += coords.transform;
			}
		});
		//plane2 move
		stompClient.subscribe('/plane/coordsing', function(message) {
			var coords = JSON.parse(message.body)

			if (coords.id != id) {
				client2 = coords.id
				if (coords.y != null && coords.x != null) {
					document.getElementById("plane2").style.top = coords.y + "%"
					document.getElementById("plane2").style.left = coords.x + "%"

				}

				document.getElementById("plane2").style.transform += coords.transform
				Planes.find(o => o.name === "plane2").saved_moves += coords.transform;
			}
		});
		//plane1 shoot
		stompClient.subscribe('/plane/shoot', function(message) {
			var array = JSON.parse(message.body)
			if (array.id != id) {
				Planes.find(o => o.name === "plane1").Fire(player)
			}

		})
		//plane2 shoot
		stompClient.subscribe('/plane/shooting', function(message) {
			var array = JSON.parse(message.body)
			if (array.id != id) {
				Planes.find(o => o.name === "plane2").Fire(player)
			}

		})
		//plane1 boost
		stompClient.subscribe('/plane/boost', function(message) {
			var array = JSON.parse(message.body)
			if (array.id != id) {
				if (array.waarde === "true") {
					document.getElementById("plane1P").style.width = 90 + "%";
					document.getElementById("plane1P").style.height = 70 + "%";
					document.getElementById("plane1F").style.width = 90 + "%";
					document.getElementById("plane1F").style.height = 100 + "%";
					document.getElementById("plane1F").src = "https://i.ibb.co/xj6XdgW/flames3.gif";
				}
				if (array.waarde === "false") {
					document.getElementById("plane1P").style.height = 70 + "%";
					document.getElementById("plane1F").src = Planes.find(o => o.name === "plane1").imgFlames;
				}
			}
		})
		//plane2 boost
		stompClient.subscribe('/plane/boosting', function(message) {
			var array = JSON.parse(message.body)
			if (array.id != id) {
				if (array.waarde === "true") {
					document.getElementById("plane2P").style.width = 90 + "%";
					document.getElementById("plane2P").style.height = 70 + "%";
					document.getElementById("plane2F").style.width = 90 + "%";
					document.getElementById("plane2F").style.height = 100 + "%";
					document.getElementById("plane2F").src = "https://i.ibb.co/xj6XdgW/flames3.gif";
				}
				if (array.waarde === "false") {
					document.getElementById("plane2P").style.height = 70 + "%";
					document.getElementById("plane2F").src = Planes.find(o => o.name === "plane2").imgFlames;
				}
			}
		})
		stompClient.subscribe('/plane/winner', function(message) {
			var array = JSON.parse(message.body)
			if (array.waarde === "true") {
				if (array.player != player) {
					wonGame("You've won!");
				}
				if (array.player === player) {
					wonGame(array.winner + " won!");
				}
			}
		});
	});
}

function wonGame(text) {
	document.getElementById("container").style.display = "none"
	document.getElementById("board").style.display = "none"
	document.getElementById("endScreen").style.display = "block"
	document.body.style.backgroundImage = '';
	document.getElementById("zin").innerHTML = text;
}

function explosion(speler) {
	// 	var img = document.createElement("img")
	// 	img.src = "https://i.ibb.co/pLp7pv6/explosie.gif"
	// 	img.style.width = 64 + "px";
	// 	img.style.height = 52 + "px";
	// 	img.style.position = "fixed";
	// 	img.style.top = Planes.find(o => o.name === "plane"+plane).planeTop +10 + "%";
	// 	img.style.left = Planes.find(o => o.name === "plane"+plane).planeLeft + "%";
	// 	img.transform = Planes.find(o => o.name === "plane"+plane).saved_moves;
	// 	document.getElementById("body").appendChild(img);
	// 	setTimeout(function() {
	// 		document.getElementById("body").removeChild(img);
	// 	}, 1000)

	audioEx.currentTime = 0;
	audioEx.volume = 0.9;
	audioEx.play();

}

function sendImage() {
	var username = document.getElementById("input").value;
	var array = {
		"img": imageChoice,
		"imgBul": imageChoiceBullet,
		"player": player,
		"username": username
	}
	stompClient.send('/app/plane/image', {}, JSON.stringify(array))

}

function getRandom() {
	const randcharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	const randchars = (function(R, M) {
		var L = R.length,
			r = M.random,
			f = M.floor;
		return function(len) {
			var i, s = "";
			for (i = 0; i < len; i++) s += R[f(r() * L)];
			return s;
		};
	})(randcharset.split(''), Math);
	return randchars(7);
}

function setConnected(connected) {
	document.getElementById("fps").style.display = "block";
	document.getElementById("score").style.color = getColorForPercentage(100)
	document.getElementById("board").style.display = "block";
	document.getElementById("container").style.display = "block";
	document.body.style.backgroundImage = "url('https://s3.gaming-cdn.com/images/products/7676/screenshot/spel-steam-agos-a-game-of-space-wallpaper-3.jpg')";
	document.body.style.backgroundSize = "contain";
	document.getElementById("footer").style.display = "none";

	const slider = document.getElementById("boost")
	const min = slider.min
	const max = slider.max
	const value = slider.value

	slider.style.background = `linear-gradient(to right, lime 0%, lime ${(value - min) / (max - min) * 100}%, black ${(value - min) / (max - min) * 100}%, black 100%)`

	slider.oninput = function() {
		this.style.background = `linear-gradient(to right, lime 0%, lime ${(this.value - this.min) / (this.max - this.min) * 100}%, black ${(this.value - this.min) / (this.max - this.min) * 100}%, black 100%)`
	};
}
window.onkeyup = function(e) {
	var kc = e.keyCode;

	if (kc === 16) {
		e.preventDefault();
		Keys.shift = false;

	}
	if (kc === 17) {
		Keys.ctrl = false;
	}
	if (kc === 39) {
		Keys.right = false;
	}
	if (kc === 38) {
		Keys.up = false;
	}
	if (kc === 37) {
		Keys.left = false;
	}

};

function load() {
	makePlane();
	if (id === client1) {
		const slider = document.getElementById("boost")
		const min = slider.min
		const max = slider.max
		const value = slider.value

		slider.style.background = `linear-gradient(to right, lime 0%, lime ${(value - min) / (max - min) * 100}%, black ${(value - min) / (max - min) * 100}%, black 100%)`

		slider.oninput = function() {
			this.style.background = `linear-gradient(to right, lime 0%, lime ${(this.value - this.min) / (this.max - this.min) * 100}%, black ${(this.value - this.min) / (this.max - this.min) * 100}%, black 100%)`
		};
	}

}
var percentColors = [{
	pct: 0.0,
	color: {
		r: 0xff,
		g: 0x00,
		b: 0
	}
},
{
	pct: 0.5,
	color: {
		r: 0xff,
		g: 0xff,
		b: 0
	}
},
{
	pct: 1.0,
	color: {
		r: 0x00,
		g: 0xff,
		b: 0
	}
}
];

var getColorForPercentage = function(pct) {
	for (var i = 1; i < percentColors.length - 1; i++) {
		if (pct < percentColors[i].pct) {
			break;
		}
	}
	var lower = percentColors[i - 1];
	var upper = percentColors[i];
	var range = upper.pct - lower.pct;
	var rangePct = (pct - lower.pct) / range;
	var pctLower = 1 - rangePct;
	var pctUpper = rangePct;
	var color = {
		r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
		g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
		b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
	};
	return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

function makePlane() {
	var plane1 = new Plane(100, 100, "https://i.ibb.co/y8tqg50/Schip.png", "https://i.ibb.co/2dbntvm/flames.gif", "plane1", 50, 20)
	Planes.push(plane1)
	Planes.find(o => o.name === "plane1").makePlane();
	var plane2 = new Plane(100, 100, "https://i.ibb.co/y8tqg50/Schip.png", "https://i.ibb.co/2dbntvm/flames.gif", "plane2", 50, 80)
	Planes.push(plane2)
	Planes.find(o => o.name === "plane2").makePlane();
}

function parseDecimal(numberVal) {
	return (numberVal / 100).toFixed(2);
}

function update() {
	if (player === "player1") {
		requestAnimationFrame(function() {
			Planes.find(o => o.name === "plane1").Move()
		}, 1000);
	}
	if (player === "player2") {
		requestAnimationFrame(function() {
			console.log("player2 move")
			Planes.find(o => o.name === "plane2").Move()

		}, 1000);
	}
}

function settings() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("footer").style.display = "none";
	document.getElementById("setting").style.display = "block";
	document.getElementById("back").style.display = "block";
	document.getElementById("setting").style.display = "flex";
	document.getElementById("setting1").style.display = "block";
	document.getElementById("setting1").style.display = "flex";
}

function chooseImage(event) {
	imageChoice = event.src;
}

function chooseImageBullet(event) {
	imageChoiceBullet = event.src;
}

function checkCollision(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
}

function fadeIn() {
	document.getElementById('body').style.opacity = "0";
	var fade = document.getElementById("body");
	var opacity = 0;
	var intervalID = setInterval(function() {

		if (opacity < 1) {
			opacity = opacity + 0.1
			fade.style.opacity = opacity;
		} else {
			clearInterval(intervalID);
		}
	}, 100);
}

function login() {
	audio.play();
	audio.loop = true;
	fadeIn()
	document.getElementById("login").style.display = "none";
	document.getElementById("menu").style.display = "block";
	document.getElementById("menu").style.display = "flex";
	document.getElementById("input").oninput = function() {
		TypSound.currentTime = 0;
		TypSound.play();
	}
}

function PlaySound(action, event) {
	if (action === "hover") {
		var thissound = HoverSound
		thissound.play();
	} else if (action === "click") {
		var thissound = ClickSound
		thissound.play();
	}


	event.target.style.transform = 'rotate(360deg)';
	event.target.style.transform = 'scale(1.06)';
}

function StopSound(event) {
	var thissound = HoverSound
	thissound.pause();
	thissound.currentTime = 0;
	event.target.style.transform = 'scale(1)';
}

function fpsMeter() {
	let prevTime = Date.now(),
		frames = 0;

	requestAnimationFrame(function loop() {
		const time = Date.now();
		frames++;
		if (time > prevTime + 1000) {
			let fps = Math.round((frames * 1000) / (time - prevTime));
			prevTime = time;
			frames = 0;
			document.getElementById("text").innerHTML = "";
			document.getElementById("text").innerHTML = "FPS: " + fps;
		}

		requestAnimationFrame(loop);
	});
}
fpsMeter();
$(function() {
	// 	$("form").on('submit', function(e) {
	// 		e.preventDefault();
	// 	});
	
	$("#start").click(function() {
		connect();
	});
	$("#settings").click(function() {
		settings();
	});
	$("#back").click(function() {
		document.getElementById("menu").style.display = "block";
		document.getElementById("footer").style.display = "block";
		document.getElementById("menu").style.display = "flex";
		document.getElementById("setting").style.display = "none";
		document.getElementById("setting1").style.display = "none";
		document.getElementById("back").style.display = "none";
	});
});