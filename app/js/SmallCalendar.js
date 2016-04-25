var Calendar = function() {

	Date.prototype.getFullDay = function() {
		return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
	};

	Date.prototype.getNewMonth = function() {
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		return monthNames[this.getMonth()];
	};

	Date.prototype.getDayOfWeek = function() {
		var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

		return dayNames[this.getNewDay()];
	};

	Date.prototype.getNewDay = function() { //получение дня 0(понедельник) - 6 (воскресенье)
		var d = this.getDay();
		if (d === 0) d = 7;
		return d - 1;
	};

	Date.prototype.getFormatDate = function() {
		var day = this.getDate() < 10 ? "0" + this.getDate(): this.getDate(),
			month = (this.getMonth() + 1) < 10 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1;

		return day + "-" + month + "-" + this.getFullYear();	  
	};



	function Init(year, month, elem) {
		this._year = year;
		this._month = month;
		this._date = new Date(year, this._month);
		this._elem = elem;
		this._createCalendar = this._createCalendar.bind(this);

		this._createCalendar();
		this._table.addEventListener("click", this._clickEvent.bind(this));
	}

	Init.prototype._createCalendar = function() {
		if (!this._table) {
			this._table = document.createElement("table");
			this._table.id = "simpleCalendar";
			this._elem.appendChild(this._table);
			console.log("createTable");
		}

		var table = "<thead><tr><td><div class='scArrLeft scYearChange'></div></td><td colspan='5' class='scYear'>"+this._year+"</td><td><div class='scArrRight scYearChange'></div></td></tr><tr><td><div class='scArrLeft scMonthChange'></div></td><td colspan='5' class='scMonth'>"+this._date.getNewMonth()+"</td><td><div class='scArrRight scMonthChange'></div></td></tr><tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr></thead>";
			table += "<tbody>";

		var startDay = this._date.getNewDay();

		if (startDay > 0) {
				table += "<th colspan="+startDay+"></th>";
			}

		while(this._date.getMonth() === this._month) {
			table += "<td>"+this._date.getDate()+"</td>";

			if (this._date.getNewDay() === 6 && this._date.getDate() !== this._date.getFullDay()) {
				table += "</tr><tr>";
			}

			this._date.setDate(this._date.getDate() + 1);
		}

		this._date.setDate(this._date.getDate() - 1);

		if (this._date.getNewDay() < 6) {
			table += "<th colspan="+(6 - this._date.getNewDay())+"></th>";
		}

		table += "</tr></tbody></table>";

		this._table.innerHTML = table;
	};

	Init.prototype._clickEvent = function(e) {
		var target = e.target;

		if (target.closest("thead")) {
			
			if (target.classList.contains("scYearChange")) {
					
				if (target.classList.contains("scArrLeft")) {

					this._prevYear();

				} else if (target.classList.contains("scArrRight")) {

					this._nextYear();

				}

			} else if (target.classList.contains("scMonthChange")) {

				if (target.classList.contains("scArrLeft")) {

					this._prevMonth();

				} else if (target.classList.contains("scArrRight")) {

					this._nextMonth();

				}				

			}

		} else {
			if (target.tagName !== "TD") return;

			var eve = document.createEvent("CustomEvent");
			eve.initCustomEvent("selectDate", true, true, new Date(this._year, this._month, +target.innerHTML));

			this._elem.dispatchEvent(eve);
		}

	};

	Init.prototype._prevMonth = function() {
		if (this._month > 0) this.setDate(this._year, this._month - 1);
	};

	Init.prototype._nextMonth = function() {
		if (this._month < 11) this.setDate(this._year, this._month + 1);
	};

	Init.prototype._prevYear = function() {
		this.setDate(--this._year, this._month);
	};

	Init.prototype._nextYear = function() {
		this.setDate(++this._year, this._month);
	};

	Init.prototype._redrawCalendar = function() {
		this._date = new Date(this._year, this._month);
		this._createCalendar();

		if (this._month === 0) this._table.querySelector(".scArrLeft.scMonthChange").classList.add("hidden");
		if (this._month === 11) this._table.querySelector(".scArrRight.scMonthChange").classList.add("hidden");
	};

	Init.prototype.setDate = function(year, month) {
		console.log(this._month);
		if (month < 0 || month > 11) return;
		this._year = year;
		this._month = month;
		console.log(this._month);
		this._redrawCalendar();
	};

	return Init;

}();