var Calendar = function(text) {

	function Init(year, month, elem) {
		this._year = year;
		this._month = month;
		this._date = new Date(year, month - 1);
		this._elem = elem;

		this._createCalendar.bind(this)();
		this._table.addEventListener("click", this._clickEvent.bind(this));
	}

	Init.prototype._createCalendar = function() {

		if (!this._table) {
			this._table = document.createElement("table");
			this._table.id = "simpleCalendar";
			this._elem.appendChild(this._table);
			console.log("createTable");
		}

		var table = "<thead><tr><td class='scArrLeft scYearArrLeft'></td><td colspan='5' class='scYear'>"+this._year+"</td><td class='scArrRight scYearArrRight'></td></tr><tr><td class='scArrLeft scMonthArrLeft'></td><td colspan='5' class='scMonth'>"+this._getMonth(this._month)+"</td><td class='scArrRight scMonthArrRight'></td></tr><tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr></thead>";
			table += "<tbody>";

		var startDay = this._getDay(this._date);

		if (startDay > 0) {
				table += "<th colspan="+startDay+"></th>";
			}

		console.log(this._date.getMonth());
		console.log(this._month);

		while(this._date.getMonth() !== this._month) {
			table += "<td>"+this._date.getDate()+"</td>";

			if (this._getDay(this._date) === 6) {
				table += "</tr><tr>";
			}

			this._date.setDate(this._date.getDate() + 1);
		}

		this._date.setDate(this._date.getDate() - 1);

		if (this._getDay(this._date) < 6) {
			table += "<th colspan="+(6 - this._getDay(this._date))+"></th>";
		}

		table += "</tr></tbody></table>";

		this._table.innerHTML = table;

	};

	Init.prototype._clickEvent = function(e) {
		var target = e.target;

		console.log(target);

		if (target.classList.contains("yearArrLeft")) {
			this._year--;
			this._date = new Date(this._year, this._month - 1);
			this._createCalendar();
		}

		if (target.classList.contains("yearArrRight")) {
			this._year++;
			this._date = new Date(this._year, this._month - 1);
			this._createCalendar();
		}
	};

	Init.prototype._getMonth = function(month) {
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		return monthNames[month-1];
	};

	Init.prototype._getDay = function(date) { //получение дня 0(понедельник) - 6 (воскресенье)
		var d = date.getDay();
		if (d === 0) d = 7;
		return d - 1;
	};

	return Init;

}("init");