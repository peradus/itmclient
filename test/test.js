function testJS() {

	var instances = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	var dest = document.getElementById("demo");
	var list = document.createElement("ul");

	instances.forEach(function (item) {

		var listitem = document.createElement("li");
		var item = document.createTextNode("Item#" + item);
		listitem.appendChild(item);
		list.appendChild(listitem);

		dest.appendChild(list);
	});

}
