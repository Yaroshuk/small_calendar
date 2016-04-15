var Calendar = function(text) {

	function Init(year, month, elem) {
		this._year = year;
		this._month = month;
		this._date = new Date(year, month - 1);
		this._elem = elem;

		this._createCalendar.bind(this)();
	}

	Init.prototype._createCalendar = function() {
		var table = "<table class='sCalendar'><tr><td colspan='7' class='year'>"+this._year+"</td></tr><tr><td colspan='7' class='month'>"+this._getMonth(this._month)+"</td></tr>";
			table += "<tr><th>ПН</th><th>ВТ</th><th>СР</th><th>ЧТ</th><th>ПТ</th><th>СБ</th><th>ВС</th></tr><tr>";
		var startDay = this._getDay(this._date);
		if (startDay > 0) {
			for(var i = 0; i < startDay; i++) {
				table += "<td></td>";
			}
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
			for (var i = this._getDay(this._date), max = 6; i < max; i++) {
				table += "<td></td>";
			}
		}

		table += "</tr></table>";

		this._elem.innerHTML = table;
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