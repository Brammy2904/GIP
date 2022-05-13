var array = [];
var count = 0;
window.onload = function() {
	var image = document.createElement("img")
	image.src = "http://192.168.18.151:8080/images/background2.png";
	image.style.width = 192 + "px"
	image.style.height = 161 + "px";
	image.setAttribute("class", "logo")
	document.body.append(image)
	getHighScores()
}
function search() {
	var searchText = document.getElementById('search').value;
	document.getElementById("highScores").style.display = "none"
	document.getElementById("highScores").innerHTML = '';
	if (searchText === "") {

		getHighScores()

	} else {
		axios.get('http://192.168.18.151:8080/getHighScore?name=' + searchText).then(async function(response) {
			if (response.data.length === 0) {

				var row = document.createElement("div")
				row.classList.add("rowN")
				var column1 = document.createElement("div")
				column1.classList.add("column")
				var b2 = document.createElement("B");
				var t2 = document.createTextNode("No results found...");
				b2.append(t2)
				b2.style.color = "white"

				column1.append(b2)
				row.append(column1)
				document.getElementById("highScores").append(row)

			} else {
				for (score of response.data) {
					var place = 0;
					for (var i = 0; i < array.length; i++) {
						if (array[i].id === score.id) {
							place = array[i].place;
						}
					}
					var time = score.time;
					var name = score.name;
					var levens = score.levens;
					var loser = score.loser;
					var row = document.createElement("div")
					row.classList.add("row")
					var column = document.createElement("div")
					column.classList.add("column")
					var b0 = document.createElement("B");
					b0.style.fontSize = "35px"
					var t0 = document.createTextNode(place+"th");
				
				if (place === 1) {
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)"
					t0 = document.createTextNode(place+"st")
				}
				else if (place === 2) {
					t0 = document.createTextNode(place+"nd")
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #808080 0%, #b5b5b5 30%, #787878 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #f2f2f2 8%, #999999 25%, #404040 62.5%, #262626 100%)"

				}
				else if (place === 3) {
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #c8671e 0%, #ebab7a 30%, #b15c1b 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #fcf1e9 8%, #e48f4e 25%, #6f3911 62.5%, #582e0e 100%)"
					t0 = document.createTextNode(place+"rd")

				}
				b0.append(t0)
					column.append(b0)
					var column1 = document.createElement("div")
					column1.classList.add("column")
					var b = document.createElement("B");
					var t = document.createTextNode(name);
					b.append(t)
					column1.append(b)
					var column4 = document.createElement("div")
					column4.classList.add("column")
					var b4 = document.createElement("B");
					var t4 = document.createTextNode(loser);
					b4.append(t4)
					column4.append(b4)
					var column2 = document.createElement("div")
					column2.classList.add("column")
					var b1 = document.createElement("B");
					var t1 = document.createTextNode(levens + "/50");
					b1.append(t1)
					column2.append(b1)
					var column3 = document.createElement("div")
					column3.classList.add("column")
					var b2 = document.createElement("B");
					var t2 = document.createTextNode(time + " seconds");
					b2.append(t2)
//					column.style.color = getRandomColor();
//					column1.style.color = getRandomColor();
//					column2.style.color = getRandomColor();
//					column3.style.color = getRandomColor();
					column3.append(b2)
					row.append(column)
					row.append(column1)
					row.append(column4)
					row.append(column2)
					row.append(column3)
					document.getElementById("highScores").append(row)
				}
			}

		}).then(function() {

			document.getElementById("highScores").style.display = "block";


		})
	}
}
function getHighScores() {
	document.getElementById("highScores").style.display = "none";
	axios.get('http://192.168.18.151:8080/highscore')
		.then(function(response) {
			for (score of response.data) {
				count++;
				var time = score.time;
				var name = score.name;
				var levens = score.levens;
				var loser = score.loser;
				var array1 = { "id": score.id, "name": name, "levens": levens, "time": time, "place": count, "loser": loser }
				array.push(array1);
				var row = document.createElement("div")
				row.classList.add("row")
				var column = document.createElement("div")
				column.classList.add("column")
				var b0 = document.createElement("B");
				b0.style.fontSize = "35px"
				var t0 = document.createTextNode(count+"th");
				
				if (count === 1) {
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)"
					t0 = document.createTextNode(count+"st")
				}
				else if (count === 2) {
					t0 = document.createTextNode(count+"nd")
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #808080 0%, #b5b5b5 30%, #787878 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #f2f2f2 8%, #999999 25%, #404040 62.5%, #262626 100%)"
				}
				else if (count === 3) {
					row.style.background = "radial-gradient(ellipse farthest-corner at right bottom, #c8671e 0%, #ebab7a 30%, #b15c1b 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #fcf1e9 8%, #e48f4e 25%, #6f3911 62.5%, #582e0e 100%)"
					t0 = document.createTextNode(count+"rd")

				}
				b0.append(t0)
				column.append(b0)
				var column1 = document.createElement("div")
				column1.classList.add("column")
				var b = document.createElement("B");
				var t = document.createTextNode(name);
				b.append(t)
				column1.append(b)
				var column4 = document.createElement("div")
				column4.classList.add("column")
				var b4 = document.createElement("B");
				var t4 = document.createTextNode(loser);
				b4.append(t4)
				column4.append(b4)
				var column2 = document.createElement("div")
				column2.classList.add("column")
				var b1 = document.createElement("B");
				var t1 = document.createTextNode(levens + "/50");
				b1.append(t1)
				column2.append(b1)
				var column3 = document.createElement("div")
				column3.classList.add("column")
				var b2 = document.createElement("B");
				var t2 = document.createTextNode(time + " seconds");
				b2.append(t2)
				column3.append(b2)
				row.append(column)
				row.append(column1)
				row.append(column4)
				row.append(column2)
				row.append(column3)

				document.getElementById("highScores").append(row)

			}
		}).then(function() {
			document.getElementById("highScores").style.display = "block";
			count = 0;
		})
}
function back() {
	location.href = "http://192.168.18.151:8080/start"
}
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}