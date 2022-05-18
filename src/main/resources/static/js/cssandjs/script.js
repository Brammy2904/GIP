var userName;
var theme;
var intrvl;
var hpNeeded = 0;
let canvas;
var timeout;
var lifeInterval;
var spelDuur = 0;
var HoverSound = new Audio("http://192.168.18.72:8080/sounds/buttonHover.wav")
var ClickSound = new Audio("http://192.168.18.72:8080/sounds/click.wav")
var audio = new Audio("http://192.168.18.72:8080/sounds/menuSong.mp3");
var startSound = new Audio("http://192.168.18.72:8080/sounds/countdown.mp3")
var TypSound = new Audio("http://192.168.18.72:8080/sounds/typSound.mp3")
var waiting = ["http://192.168.18.72:8080/sounds/waiting.mp3"]
var waitingSound = new Audio(waiting[Math.floor(Math.random() * waiting.length)])
var winner;
var loser;
var stompClient = null;
var Ids = [];
var audioEx = new Audio("http://192.168.18.72:8080/sounds/explosie.wav")
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
	audioShoot = new Audio("http://192.168.18.72:8080/sounds/Blast.mp3");
	audioBoost = new Audio("http://192.168.18.72:8080/sounds/boost.mp3");
	soundShoot = false;
	executed = false;
	nickname;
	levens = 10;
	vlam = "false";
	rotation;
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
		div.style.position = "absolute";
		div.style.width = this.width + "px";
		div.style.height = this.height + "px";
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
		var raken1 = collide(rect, document.getElementById("astro").getBoundingClientRect())

		if (raken1 === "bottom") {
			plane.style.top = parseInt(plane.style.top) + 1 + "%"
			move = ""
		}
		if (raken1 === "left") {
			plane.style.left = parseInt(plane.style.left) - 1 + "%"
			move = ""
		}
		if (raken1 === "right") {
			plane.style.left = parseInt(plane.style.left) + 1 + "%"
			move = ""
		}
		if (raken1 === "none") {
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
					if (!Keys.ctrl) {
						this.vlam = "true";
					}
					else if (Keys.ctrl) {
						this.vlam = "boost"
						document.getElementById(this.name + "F").style.display = "block"
					}
					move = move + ' translateY( -' + Math.round(this.speed) / 10 + 'vh )'
					if (document.getElementById(this.name + "F").style.display != "block") {
						document.getElementById(this.name + "F").style.display = "block"

					}
					if (!(document.getElementById(this.name + "F").src === 'http://192.168.18.72:8080/images/flames.gif') && !Keys.ctrl) {
						document.getElementById(this.name + "F").src = 'http://192.168.18.72:8080/images/flames.gif'

					}
				}
			}

			if (!Keys.up && !(Keys.space && Keys.left) && !(Keys.space && Keys.right) && !Keys.ctrl) {
				if (document.getElementById(this.name + "F").style.display != "none") {
					document.getElementById(this.name + "F").style.display = "none";
					this.vlam = "false";
				}
			}

			if (Keys.space && Keys.left) {
				if (rect.top <= 0) {
					plane.style.top = parseInt(plane.style.top) + 1 + "vh"
				}
				if (rect.bottom >= maxHeight) {
					plane.style.top = parseInt(plane.style.top) - 1 + "vh"
				}
				if (rect.left <= 0) {
					plane.style.left = parseInt(plane.style.left) + 1 + "vh"
				}
				if (rect.right >= maxWidth) {
					plane.style.left = parseInt(plane.style.left) - 1 + "vh"
				}
				else {
					move = move + 'translate(-1vh, 0 )'
				}
				this.vlam = "links";
				document.getElementById(this.name + "F").style.display = "block";
				if (!(document.getElementById(this.name + "F").src
					=== 'http://192.168.18.72:8080/images/flameLinks.gif')) {
					document.getElementById(this.name + "F").src =
						'http://192.168.18.72:8080/images/flameLinks.gif'
				}

			}
			if (Keys.space && Keys.right) {
				if (rect.top <= 0) {
					plane.style.top = parseInt(plane.style.top) + 1 + "vh"
				}
				if (rect.bottom >= maxHeight) {
					plane.style.top = parseInt(plane.style.top) - 1 + "vh"
				}
				if (rect.left <= 0) {
					plane.style.left = parseInt(plane.style.left) + 1 + "vh"
				}
				if (rect.right >= maxWidth) {
					plane.style.left = parseInt(plane.style.left) - 1 + "vh"
				}
				else {
					move = move + 'translate(1vh, 0 )'

				}
				this.vlam = "rechts";
				document.getElementById(this.name + "F").style.display = "block";
				if (!(document.getElementById(this.name + "F").src === 'http://192.168.18.72:8080/images/flameRechts.gif')) {
					document.getElementById(this.name + "F").src = 'http://192.168.18.72:8080/images/flameRechts.gif'
				}
			}
			if (Keys.right && !Keys.space) {
				//			plane.style.transform += 'rotate( 3deg )';
				move = move + ' rotate( 3deg )'
				this.rotation += ' rotate( 3deg )'
			} else if (Keys.left && !Keys.space) {
				//			plane.style.transform += 'rotate( -3deg )';
				move = move + ' rotate( -3deg )'
				this.rotation += ' rotate( -3deg )'
			}
			if (Keys.ctrl) {
				document.getElementById(this.name + "F").style.display = "block";
				this.vlam = "boost"
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
				//			this.vlam = "false"
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


		if (this.name === "plane1") {
			var coords = {
				"x": x,
				"y": y,
				"transform": move,
				"id": id,
				"vlam": this.vlam
			}
			stompClient.send("/app/plane/move1", {}, JSON.stringify(coords));
		}
		if (this.name === "plane2") {
			var coords = {
				"x": x,
				"y": y,
				"transform": move,
				"id": id,
				"vlam": this.vlam
			}
			stompClient.send("/app/plane/move2", {}, JSON.stringify(coords));
		}

		plane.style.transform += move;
		//		var animation = 
		requestAnimationFrame(function(plane) {
			return function() {
				Planes.find(o => o.name === plane.name).Move()
			};
		}(this));
		//		animation()
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
	checkCol(bounding, bullet, inter) {
		var raken = checkCollision(bounding, document.getElementById("astro").getBoundingClientRect())
		if (raken) {
			if (player.split("r")[1] === this.name.split("e")[1]) {
				var sound = new Audio('http://192.168.18.72:8080/sounds/hitWall.mp3')
				sound.volume = 0.9;
				sound.play();
			}

			document.getElementById("container").removeChild(bullet);
			clearInterval(inter)
		}
	}
	checkRaken(plane, bounding, bullet, planeId, inter) {
		if (plane.name === "plane1") {
			var vliegtuig = document.getElementById("plane2").getBoundingClientRect();
			var rakenPlane = checkCollision(bounding, vliegtuig);
			if (rakenPlane) {
				if (document.getElementsByClassName("explosie")[0] != null) {
					var elems = Array.from(document.getElementsByClassName("explosie"));
					elems.forEach(div => {
						div.remove();
					})
				}
				document.getElementById("container").append(new Explosie(106, 176,
					"http://192.168.18.72:8080/images/expl.gif",
					document.getElementById("plane2").getBoundingClientRect().y,
					document.getElementById("plane2").getBoundingClientRect().x).explode())
				setTimeout(function() {
					var explosies = document.getElementsByClassName("explosie");
					for (var i = 0; i < explosies.length; i++) {
						document.getElementById("container").removeChild(explosies[i])
					}
				}, 600)
				Planes.find(o => o.name === "plane2").levens -= 1;
				if (player === "Player2") {
					//
					//					var perc = parseDecimal(Planes.find(o => o.name === "plane2").levens * 2)
					//					document.getElementById("score").style.color = getColorForPercentage(perc)
					//					document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane2").levens;

					var perc = parseDecimal((Planes.find(o => o.name === "plane2").levens * 10))
					document.getElementById("score").style.color = getColorForPercentage(perc)
					document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane2").levens;
					if (Planes.find(o => o.name === "plane2").levens === hpNeeded) {
						Planes.find(o => o.name === "plane2").levens = 0;
						if (Planes.find(o => o.name === "plane1").nickname != null) {
							winner = Planes.find(o => o.name === "plane1").nickname
						} else {
							winner = "Player1";
						}
						loser = Planes.find(o => o.name === "plane2").nickname
							!= null ? Planes.find(o => o.name === "plane2").nickname : "Player2"
						var array = {
							"player": player,
							"winner": winner,
							"plane": plane.name,
							"loser": loser
						}
						stopTimer();
						stompClient.send("/app/plane/won", {}, JSON.stringify(array));
					}

				}
				document.getElementById("container").removeChild(bullet)
				//				explosion(planeId)

				clearInterval(inter)
				//							trany = 0;
			}
		}
		if (plane.name === "plane2") {
			var vliegtuig = document.getElementById("plane1").getBoundingClientRect();
			var rakenPlane = checkCollision(bounding, vliegtuig);
			if (rakenPlane) {
				if (document.getElementsByClassName("explosie")[0] != null) {
					var elems = Array.from(document.getElementsByClassName("explosie"));
					elems.forEach(div => {
						div.remove();
					})
				}
				document.getElementById("container").append(new Explosie(106, 176,
					"http://192.168.18.72:8080/images/expl.gif",
					document.getElementById("plane1").getBoundingClientRect().y,
					document.getElementById("plane1").getBoundingClientRect().x).explode())
				setTimeout(function() {
					var explosies = document.getElementsByClassName("explosie");
					for (var i = 0; i < explosies.length; i++) {
						document.getElementById("container").removeChild(explosies[i])
					}
				}, 600)
				Planes.find(o => o.name === "plane1").levens -= 1;
				if (player === "Player1") {

					//					var perc = parseDecimal(Planes.find(o => o.name === "plane1").levens * 2)
					//					document.getElementById("score").style.color = getColorForPercentage(perc)
					//					document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane1").levens;
					var perc = parseDecimal((Planes.find(o => o.name === "plane1").levens * 10))
					document.getElementById("score").style.color = getColorForPercentage(perc)
					document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane1").levens;
					if (Planes.find(o => o.name === "plane1").levens === hpNeeded) {
						Planes.find(o => o.name === "plane1").levens = 0;
						if (Planes.find(o => o.name === "plane2").nickname != null) {
							winner = Planes.find(o => o.name === "plane2").nickname
						} else {
							winner = "Player2";
						}
						loser = Planes.find(o => o.name === "plane1").nickname != null ? Planes.find(o => o.name === "plane1").nickname : "Player1"
						var array = {
							"player": player,
							"winner": winner,
							"plane": plane.name,
							"loser": loser
						}
						stompClient.send("/app/plane/won", {}, JSON.stringify(array));
						stopTimer();
					}

				}
				document.getElementById("container").removeChild(bullet)
				//				explosion(planeId)

				clearInterval(inter)
				//							trany = 0;
			}
		}
	}
	makeAstro() {
		var image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = 'http://192.168.18.72:8080/images/wall.png'
		image.style.position = "fixed"
		image.setAttribute("id", "astro")
		image.style.width = 10 + "%"
		image.style.height = 60 + "%"
		image.style.top = 0 + "%"
		image.style.left = 50 - (parseInt(image.style.width) / 2) + "%"

		document.getElementById('container').append(image)
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
		var saved2 = plane.rotation;
		var planeId = plane.name.substring(5, 6)
		var bullet = document.createElement("img")
		if (player != null) {
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
		var rectP = document.getElementById(plane.name).getBoundingClientRect();
		var cx = rectP.left + rectP.width * 0.5;
		var cy = rectP.top + rectP.height * 0.5;
		var x = cx - this.width * 0.5;
		var y = cy - this.height * 0.5;
		bullet.style.position = "absolute";
		bullet.style.width = this.width + "px";
		bullet.style.height = this.height + "px";
		bullet.setAttribute("class", "bullet" + planeId)
		bullet.setAttribute("id", "bullet" + planeId)
		bullet.style.zIndex = "0"
		if (window.innerWidth < 1000) {
			if (plane.name === "plane1") {
				bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 4 + "%";
				bullet.style.left = parseInt(document.getElementById(plane.name).style.left) + 5 + "%"
			} else {
				bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 7 + "%";
				bullet.style.left = parseInt(document.getElementById(plane.name).style.left) + 4 + "%"
			}
		}
		else {
			if (plane.name === "plane1") {
				bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 4 + "%";
				bullet.style.left = parseInt(document.getElementById(plane.name).style.left) + 3 + "%"
			} else {
				bullet.style.top = parseInt(document.getElementById(plane.name).style.top) + 5 + "%";
				bullet.style.left = parseInt(document.getElementById(plane.name).style.left) + 2 + "%"
			}
		}
		bullet.style.transform = saved;
		document.getElementById("container").append(bullet)
		var inter = setInterval(function(plane) {
			return function() {
				trany -= 7;
				bullet.style.transform = saved + 'translateY(' + trany + 'vmin)';
				var bullets = document.getElementsByClassName("bullet" + planeId)
				for (var i = 0; i < bullets.length; i++) {
					const bounding = bullets[i].getBoundingClientRect();
					plane.checkRaken(plane, bounding, bullets[i], planeId, inter);
					plane.checkCol(bounding, bullets[i], inter)
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
class Explosie {
	width;
	height;
	img;
	exTop;
	exLeft;
	constructor(width, height, img, exTop, exLeft) {
		this.width = width;
		this.height = height;
		this.img = img;
		this.exTop = exTop;
		this.exLeft = exLeft;
	}
	explode() {
		var image = new Image();
		image.style.position = "fixed";
		image.src = this.img;
		image.style.width = this.width + "px";
		image.style.height = this.height + "px";
		image.style.top = this.exTop
			- 25

			+ "px";
		image.style.left = this.exLeft
			- 10
			+ "px";
		image.style.zIndex = "5"
		image.setAttribute("class", "explosie");
		audioEx.currentTime = 0;
		audioEx.volume = 0.9;
		audioEx.play();
		return image;
	}
}
function connect() {
	var socket = new SockJS('http://192.168.18.72:8080/websocket', [], {
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
		stompClient.send('/app/plane/id', {}, id)
		var start = stompClient.subscribe('/plane/name/test', function(message) {
			var value = message.body;
			if (player == null) {
				if (value === "1") {
					player = "Player1";
					console.log("Player1")
					document.getElementsByClassName("loading")[0].style.display = "block"
					document.getElementById("HoofdContainer").style.display = "none"
					waitingSound.play();
					audio.pause();
				} else {
					player = "Player2"
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
					var countdown1 = document.getElementById('countdown')
					countdown1.style.display = "block"
					document.getElementById("HoofdContainer").style.display = "none"
					startSound.play();
					var countD = 4;
					var inter = setInterval(function() {
						countD--
						countdown1.innerHTML = "Game starts in " + countD;
					}, 1000)
					timeout = setTimeout(function() {
						clearInterval(inter)
						setConnected("none");
						document.getElementById('plane2').style.display = "block"
						document.getElementById('plane1').style.display = "block"
						countdown1.style.display = "none"
						theme = new Audio("http://192.168.18.72:8080/sounds/BattleThemeSong.mp3");
						theme.volume = 0.2;
						theme.loop = true;
						theme.play();
						startTimer();
						if (player === "Player1") {
							lifeInterval = setInterval(function() {
								var winWidth = window.innerWidth;
								var winHeight = window.innerHeight;
								var coords = { "width": winWidth, "height": winHeight, "player": player };
								stompClient.send("/app/plane/lifes", {}, JSON.stringify(coords));
							}, 15000)
						}
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
					if (array[i].player != null) {
						speler = array[i].player.split("r", 2)[1]
					}
					if (array[i].username != "") {
						document.getElementById("plane" + speler + "text").textContent = array[i].username
						Planes.find(o => o.name === "plane" + speler).nickname = array[i].username;

					}
					else {
						document.getElementById("plane" + speler + "text").textContent = "plane" + speler
					}
					if (array[i].img != null) {
						document.getElementById("plane" + speler + "P").src = array[i].img;
					}
					if (array[i].imgBul != null) {
						imgBull = array[i].imgBul;
					}
				} else {
					var speler;
					if (array[i].player != null) {
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
				if (coords.vlam != null) {
					if (coords.vlam === "true") {
						document.getElementById("plane1F").style.display = "block"
						if (!(document.getElementById("plane1F").src === "http://192.168.18.72:8080/images/flames.gif")) {
							document.getElementById("plane1F").src = "http://192.168.18.72:8080/images/flames.gif"
						}
					}
					else if (coords.vlam === "false") {
						document.getElementById("plane1F").style.display = "none"
					}
					else if (coords.vlam === "rechts") {
						document.getElementById("plane1F").style.display = "block"
						if (!(document.getElementById("plane1F").src === "http://192.168.18.72:8080/images/flameRechts.gif")) {
							document.getElementById("plane1F").src = "http://192.168.18.72:8080/images/flameRechts.gif"

						}
					}
					else if (coords.vlam === "links") {
						document.getElementById("plane1F").style.display = "block"
						if (!(document.getElementById("plane1F").src === "http://192.168.18.72:8080/images/flameLinks.gif")) {
							document.getElementById("plane1F").src = "http://192.168.18.72:8080/images/flameLinks.gif"
						}
					}
					else if (coords.vlam === "boost") {
						document.getElementById("plane1F").style.display = "block"
						if (!(document.getElementById("plane1F").src === "http://192.168.18.72:8080/images/flames3.gif")) {
							document.getElementById("plane1F").src = "http://192.168.18.72:8080/images/flames3.gif"
						}
					}

				}
				//				else {
				//					document.getElementById("plane1F").style.display = "none"
				//				}
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
				if (coords.vlam != null) {
					if (coords.vlam === "true") {
						document.getElementById("plane2F").style.display = "block"
						if (!(document.getElementById("plane2F").src === "http://192.168.18.72:8080/images/flames.gif")) {
							document.getElementById("plane2F").src = "http://192.168.18.72:8080/images/flames.gif"
						}
					}
					else if (coords.vlam === "false") {
						document.getElementById("plane2F").style.display = "none"
					}
					else if (coords.vlam === "rechts") {
						document.getElementById("plane2F").style.display = "block"
						if (!(document.getElementById("plane2F").src === "http://192.168.18.72:8080/images/flameRechts.gif")) {
							document.getElementById("plane2F").src = "http://192.168.18.72:8080/images/flameRechts.gif"

						}
					}
					else if (coords.vlam === "links") {
						document.getElementById("plane2F").style.display = "block"
						if (!(document.getElementById("plane2F").src === "http://192.168.18.72:8080/images/flameLinks.gif")) {
							document.getElementById("plane2F").src = "http://192.168.18.72:8080/images/flameLinks.gif"
						}
					}
					else if (coords.vlam === "boost") {
						document.getElementById("plane2F").style.display = "block"
						if (!(document.getElementById("plane2F").src === "http://192.168.18.72:8080/images/flames3.gif")) {
							document.getElementById("plane2F").src = "http://192.168.18.72:8080/images/flames3.gif"
						}
					}

				}
				else {
					document.getElementById("plane2F").style.display = "none"
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
		stompClient.subscribe('/plane/spawn', function(coords) {
			var array = JSON.parse(coords.body);

			spawnLives(array.left, array.top);

		})
		stompClient.subscribe('/plane/life', function(test) {
			var array = JSON.parse(test.body);
			if (array.player != player) {
				Planes.find(o => o.name === array.plane).levens += 1;
				if (Planes.find(o => o.name === array.plane).levens >= 50) {
					Planes.find(o => o.name === array.plane).levens = 50;
				}
				document.getElementById("container").removeChild(document.getElementById("life"))
			}
		})
		stompClient.subscribe('/plane/disconnect', function(test) {
			if (test.body === "true") {
				clearInterval(lifeInterval)
				setInterval(function() {
					party.confetti(document.body);
				}, 1000);
				wonGame("You've won! (forfeit)")
				document.getElementById('countdown').style.display = "none"
				clearTimeout(timeout)
				startSound.pause();
				stompClient.disconnect();
			}
		})
		stompClient.subscribe('/plane/winner', function(message) {
			clearInterval(lifeInterval)
			var array = JSON.parse(message.body)
			if (array.player != player) {
				wonGame("You've won!", "http://192.168.18.72:8080/sounds/victory.mp3");
				setInterval(function() {
					party.confetti(document.body);
				}, 1000);

				var name = userName != "" ? userName : array.winner;
				var loser = array.loser
				var lives = Planes.find(o => o.name === array.plane).levens;
				var array = {
					"id": score.id, "name": name,
					"levens": lives, "time": spelDuur, "loser": loser
				}
				stompClient.send("/app/plane/send/hscore", {}, JSON.stringify(array));
				stompClient.disconnect();
			}
			if (array.player === player) {
				wonGame(array.winner + " won!");
				stompClient.disconnect();
			}

		});
	});
}

function wonGame(text, url) {
	theme.pause();
	if (url != null) {
		var song = new Audio(url)
		song.volume = 0.9;
		song.play()
	}
	document.getElementById("container").style.display = "none"
	document.getElementById("board").style.display = "none"
	document.getElementById("endScreen").style.display = "block"
	document.body.style.backgroundImage = '';
	document.getElementById("zin").innerHTML = text;

}

function explosion(speler) {
	var id;
	switch (speler) {
		case "1":
			id = "2";
			break;
		case "2":
			id = "1";
			break;
	}
	var img = new Image();
	img.src = "http://192.168.18.72:8080/images/explosie.gif"
	img.style.width = 64 + "px";
	img.style.height = 52 + "px";
	img.setAttribute("class", "explosie")
	img.style.position = "absolute";
	img.style.top = document.getElementById("plane" + id + "P").getBoundingClientRect().y + "px"
	img.style.left = document.getElementById("plane" + id + "P").getBoundingClientRect().x + "px"
	img.style.zIndex = 10;
	document.getElementById("container").appendChild(img);
	setTimeout(function() {
		var explosies = document.getElementsByClassName("explosie");
		for (var i = 0; i < explosies.length; i++) {
			document.getElementById("container").removeChild(explosies[i])
		}
	}, 1090)

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
	if (kc === 32) {
		Keys.space = false;
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
function stopTimer() {
	clearInterval(intrvl);
}
function startTimer() {
	intrvl = setInterval(function() {
		spelDuur += 1;
	}, 1000)
}
function makePlane() {
	var plane1 = new Plane(100, 100, "https://i.ibb.co/y8tqg50/Schip.png", "https://i.ibb.co/2dbntvm/flames.gif", "plane1", 30, 21)
	Planes.push(plane1)
	Planes.find(o => o.name === "plane1").makePlane();
	Planes.find(o => o.name === "plane1").makeAstro();
	var plane2 = new Plane(100, 100, "https://i.ibb.co/y8tqg50/Schip.png", "https://i.ibb.co/2dbntvm/flames.gif", "plane2", 30, 75)
	Planes.push(plane2)
	Planes.find(o => o.name === "plane2").makePlane();
}

function parseDecimal(numberVal) {
	return (numberVal / 100).toFixed(2);
}

function update() {
	if (player === "Player1") {
		requestAnimationFrame(function() {
			Planes.find(o => o.name === "plane1").Move()
		}, 1000);
	}
	if (player === "Player2") {
		requestAnimationFrame(function() {
			console.log("Player2 move")
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

function collide(r1, r2) {
	var dx = (r1.x + r1.width / 2) - (r2.x + r2.width / 2);
	var dy = (r1.y + r1.height / 2) - (r2.y + r2.height / 2);
	var width = (r1.width + r2.width) / 2;
	var height = (r1.height + r2.height) / 2;
	var crossWidth = width * dy;
	var crossHeight = height * dx;
	var collision = 'none';
	//
	if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
		if (crossWidth > crossHeight) {
			collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
		} else {
			collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
		}
	}
	return (collision);
}
function Collision(a, b) {
	if (a.x <= b.x + b.width &&
		a.x + a.width >= b.x &&
		a.y <= b.y + b.height &&
		a.y + a.height >= b.y) {
		return true;
	}
	return false;
}


function checkCollision(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width))
	);
}
window.onload = function() {

}
function fadeIn() {

	document.getElementById('body').style.opacity = "0";
	var fade = document.getElementById("body");
	var opacity = 0;
	var intervalID = setInterval(function() {
		if (opacity < 1) {
			opacity = opacity + 0.05
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
function spawnLives(left, top) {
	var int1;
	var int2;
	var geraakt = false;
	var img = document.createElement("img")
	img.src = "http://192.168.18.72:8080/images/life.png"
	img.style.width = "50px"
	img.style.height = "50px"
	img.style.zIndex = 100000;
	img.style.position = "fixed"
	img.setAttribute("id", "life")
	img.style.top = top + "%";
	img.style.left = left + "%";
	document.getElementById("container").append(img)
	if (player === "Player1") {
		int1 = setInterval(function() {
			var rakenLife = checkCollision(document.getElementById("plane1").getBoundingClientRect(),
				img.getBoundingClientRect());
			if (rakenLife) {
				geraakt = true;
				Planes.find(o => o.name === "plane1").levens += 1;
				if (Planes.find(o => o.name === "plane1").levens >= 50) {
					Planes.find(o => o.name === "plane1").levens = 50;
				}
				document.getElementById("container").removeChild(img)
				var perc = parseDecimal(Planes.find(o => o.name === "plane1").levens * 2)
				document.getElementById("score").style.color = getColorForPercentage(perc)
				document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane1").levens;
				var array = {
					"player": player,
					"plane": "plane1"
				}
				stompClient.send('/app/plane/life/add', {}, JSON.stringify(array))
				clearInterval(int1)
			}
		})
		setTimeout(function() {
			if (document.getElementById("life") != null) {
				document.getElementById("container").removeChild(document.getElementById("life"))
			}
			if (int1 != null) {
				clearInterval(int1);
			}
			if (int2 != null) {
				clearInterval(int2);
			}
		}, 5000)
	}
	if (player === "Player2") {
		int2 = setInterval(function() {
			geraakt = true;
			var rakenLife = checkCollision(document.getElementById("plane2").getBoundingClientRect(), img.getBoundingClientRect());
			if (rakenLife) {
				Planes.find(o => o.name === "plane2").levens += 1;
				if (Planes.find(o => o.name === "plane2").levens >= 50) {
					Planes.find(o => o.name === "plane2").levens = 50;
				}
				document.getElementById("container").removeChild(img)
				var perc = parseDecimal(Planes.find(o => o.name === "plane2").levens * 2)
				document.getElementById("score").style.color = getColorForPercentage(perc)
				document.getElementById("score").innerHTML = Planes.find(o => o.name === "plane2").levens;
				var array = {
					"player": player,
					"plane": "plane2"
				}
				stompClient.send('/app/plane/life/add', {}, JSON.stringify(array))
				clearInterval(int2)
			}
		})
		setTimeout(function() {
			if (document.getElementById("life") != null) {
				document.getElementById("container").removeChild(document.getElementById("life"))
			}
			if (int1 != null) {
				clearInterval(int1);
			}
			if (int2 != null) {
				clearInterval(int2);
			}
		}, 5000)
	}

}
function getRandomNumber(min, max) {

	return Math.random() * (max - min) + min;

}
function PlaySound(action, event) {
	if (action === "hover") {
		var thissound = HoverSound
		thissound.play();
		event.target.style.transform = 'rotate(360deg)';
		event.target.style.transform = 'scale(1.06)';
	}
	if (action == null) {
		event.target.style.transform = 'rotate(360deg)';
		event.target.style.transform = 'scale(1.06)';
	}
	else if (action === "hoverB") {
		var thissound = HoverSound
		thissound.play();
		event.target.style.transform = 'translate( -50%, -70%) rotate(360deg)';
		event.target.style.transform = 'translate( -50%, -70%) scale(1.06)';
	}
	else if (action === "click") {
		var thissound = ClickSound
		thissound.play();
		event.target.style.transform = 'rotate(360deg)';
		event.target.style.transform = 'scale(1.06)';
	}
	else if (action === "clickB") {
		var thissound = ClickSound
		thissound.play();
		event.target.style.transform = 'translate( -50%, -70%) rotate(360deg)';
		event.target.style.transform = 'translate( -50%, -70%) scale(1.06)';
	}
	else if (action === "clickH") {
		var thissound = ClickSound
		thissound.play();
		location.href = "http://192.168.18.72:8080/highscores";
		event.target.style.transform = 'rotate(360deg)';
		event.target.style.transform = 'scale(1.06)';
	}



}

function StopSound(back, event) {
	if (back != "") {
		event.target.style.transform = 'translate( -50%, -70%) scale(1)';
	}
	else {
		event.target.style.transform = 'scale(1)';
	}
	var thissound = HoverSound
	thissound.pause();
	thissound.currentTime = 0;

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