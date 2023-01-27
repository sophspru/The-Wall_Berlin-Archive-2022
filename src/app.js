(function () {

	// vars
	let shuffleButton = document.querySelector("#shuffle");
	let next = document.querySelector("#next");
	let prev = document.querySelector("#prev");
	let list = document.querySelector("#list");
	let search = document.querySelector("#search");
	let listItems = document.querySelectorAll(".list-item");
	let numberOfListItems = 8
	let response;

	//insert content
	getRequest('src/json/data.json');

	//click shuffle button
	shuffleButton.addEventListener("click", () => {
		randomItem();
	});

	//click next button
	next.addEventListener("click", () => {
		nextItem();
	});

	document.addEventListener("keypress", function(event) {
		if (event.key === "p") {
			document.getElementById("prev").click();
			}
	});

	document.addEventListener("keypress", function(event) {
		if (event.key === "n") {
			document.getElementById("next").click();
			}
	});

		// //click prev button
		// document.addEventListener("keypress", () => {
		// 	prevItem();
		// });

	//click prev button
	prev.addEventListener("click", () => {
		prevItem();
	});

	//function get json 
	function getRequest(file) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", file);
		xhr.send();
		xhr.onload = function (e) {
			// Check if the request was a success
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				// Get and convert the responseText into JSON
				response = JSON.parse(xhr.responseText);

				//if we have a response then insert content into the list and add event listener to each list item
				insertContent(response);
				setTagsButton();
				setSortButtons();
			}
		}
	}


	function insertContent(response) {
		//delete all
		list.innerHTML = "";

		//loop through list items from json
		for (var i = 0; i < response.length; i++) {
			// create list item
			let node = document.createElement("li");
			node.classList.add("list-item");

			//very import to add the id to the list item and the data attributes
			//without these we can't get the correct item when we filters or order the list
			node.setAttribute("data-tag", response[i].tag);
			node.setAttribute("data-title", response[i].title);
			node.setAttribute("data-year", response[i].year);
			node.setAttribute("data-colors", response[i].colors);

			node.setAttribute("data-neighbourhood", response[i].neighbourhood);
			node.setAttribute("data-date", response[i].date);
			node.setAttribute("data-dimensions", response[i].dimensions);
			node.id = i;

			let child = document.createElement("div");
			child.classList.add("item");

			//relativo a descrizione testo sotto elemento
			child.innerHTML = `<img src='src/img/${response[i].image}' alt='img'/>
			<p>${response[i].title}</p>
			`;

			// fade in img
			setTimeout(() => {
				child.classList.add("show");
			}, 100 * i);

			//append child
			node.appendChild(child);

			//append event to list item
			node.addEventListener("click", (e) => {
				selectItem(e.target)
			})

			//append list item to list into DOM
			list.appendChild(node);
		}
	}

	function randomItem() {
		for (var i = list.children.length; i >= 0; i--) {
			list.appendChild(list.children[Math.random() * i | 0]);
		}
	}

	function selectItem(item) {
		console.log(item)
		if (!item.classList.contains("active")) {
			console.log("add Active")
			item.classList.add("active");
		}
		else {
			item.classList.remove("active");
		}
	}


	function nextItem() {
		if (timer) {
			var active = document.querySelector('.active');
			if (active) {
				var next = active.nextElementSibling;
				if (next) {
					active.classList.remove('active');
					next.classList.add('active');
				}
				else {
					//get first item list-item into the dom
					active.classList.remove('active');
					active = document.querySelector('.list-item');
					active.classList.add('active');
				}
			}
			timer = false;
		}
	}

	function prevItem() {
		var active = document.querySelector('.active');
		if (active) {
			var prev = active.previousElementSibling;
			if (prev) {
				active.classList.remove('active');
				prev.classList.add('active');
			}
		}
	}

	function setTagsButton() {

		//get all tags from json
		let buttons = document.querySelectorAll('.button-filter');
		//loop through buttons
		buttons.forEach((button) => {
			//attach event to button
			button.addEventListener('click', (e) => {

				//get tag value from button
				let tag = e.target.dataset.tag;

				//show all items
				if (tag == '*') {
					insertContent(response);
				}
				else {
					//insert all content
					insertContent(response);
					//remove all items that don't have the tag
					let items = document.querySelectorAll('.list-item');
					//loop all items
					items.forEach((item) => {
						//check if item has the tag
						if (!item.dataset.tag.includes(tag) && !item.dataset.colors.includes(tag)) {
							list.removeChild(item);
						}
					})
				}

			})
		})
	}


	//set sort button
	function setSortButtons() {
		let buttons = document.querySelectorAll('.button-sort');
		buttons.forEach((button) => {
			//attach event to button sort
			button.addEventListener('click', (e) => {
				let sort = e.target.dataset.sort;

				//sort by title
				if (sort == 'year<') {
					//get all items
					var subjects = document.querySelectorAll('.list-item');
					//convert to array
					var subjectsArray = Array.from(subjects);
					//sort by year
					let sorted = subjectsArray.sort(comparatorYear);
					//insert content
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'year>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorYear).reverse();
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}

				//sort by title
				else if (sort == 'title<') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle);
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else if (sort == 'title>') {
					var subjects = document.querySelectorAll('.list-item');
					var subjectsArray = Array.from(subjects);
					let sorted = subjectsArray.sort(comparatorTitle).reverse();
					sorted.forEach(e => document.querySelector("#list").appendChild(e));
				}
				else {

				}

			})
		})
	}

	function comparatorYear(a, b) {
		if (a.dataset.year < b.dataset.year)
			return -1;
		if (a.dataset.year > b.dataset.year)
			return 1;
		return 0;
	}

	function comparatorTitle(a, b) {
		if (a.dataset.title < b.dataset.title) {
			return -1;
		}
		if (a.dataset.title > b.dataset.title) {
			return 1;
		}
		return 0;
	}

	//on key press search
	let timeout = null;
	search.addEventListener('keyup', (e) => {
		// wait 1000ms after user stops typing
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			//insert all content
			insertContent(response);
			//get search value
			let search = e.target.value.toLowerCase();
			//get all items
			let items = document.querySelectorAll('.list-item');
			items.forEach((item) => {
				//if item doesn't have the search value remove it
				if (!item.dataset.title.toLowerCase().includes(search.toLowerCase())) {
					list.removeChild(item);
				}
			})
		}, 1000);
	})

	//speed of next image
	let timer = false;
	setInterval(() => {
		if (timer) {
			timer = false;
		}
		else {
			timer = true;
		}
	}, 10);

//TEACHABLE MACHINE
	let setNext = false;
	let setPrev = false;
	//let's wait at least a second before starting the loop

	setTimeout(() => {
		function drawLoop() {
			//if p5 is ready
			if (ready) {
				//se dal p5.js viene inviato il messaggio di next
				if (label == "next" && confidence > 0.95) {
					if (!setNext) {
						// nextItem();
						let setNext = true;
						let setPrev = false;

						nextItem();
						
					}
				}
				else if (label == 'prev' && confidence > 0.9) {
					if (!setPrev) {
						// prevItem();
						let setNext = false;
						let setPrev = true;

						prevItem();
						
				}
				}
				else {
					let setNext = false;
					let setPrev = false;
				}
			}
			requestAnimationFrame(drawLoop);
		}
		requestAnimationFrame(drawLoop);
	}, 1000);


})();

//button color that stays after click
const src=document.getElementById("filters");
const b1=document.querySelector("#v1")
b1.addEventListener("click", function(e) { 
b1.style.backgroundColor="yellow"
b1.style.color="black";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b2=document.querySelector("#v2")
b2.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="yellow";
b2.style.color="black";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b3=document.querySelector("#v3")
b3.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="yellow";
b3.style.color="black";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b4=document.querySelector("#v4")
b4.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="yellow";
b4.style.color="black";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b5=document.querySelector("#v5")
b5.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="yellow";
b5.style.color="black";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b6=document.querySelector("#v6")
b6.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="yellow";
b6.style.color="black";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b7=document.querySelector("#v7")
b7.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="yellow";
b7.style.color="black";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b8=document.querySelector("#v8")
b8.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="yellow";
b8.style.color="black";
b9.style.backgroundColor="black";
b9.style.color="white";
})

const b9=document.querySelector("#v9")
b9.addEventListener("click", function(e) { 
b1.style.backgroundColor="black";
b1.style.color="white";
b2.style.backgroundColor="black";
b2.style.color="white";
b3.style.backgroundColor="black";
b3.style.color="white";
b4.style.backgroundColor="black";
b4.style.color="white";
b5.style.backgroundColor="black";
b5.style.color="white";
b6.style.backgroundColor="black";
b6.style.color="white";
b7.style.backgroundColor="black";
b7.style.color="white";
b8.style.backgroundColor="black";
b8.style.color="white";
b9.style.backgroundColor="yellow";
b9.style.color="black";
})


