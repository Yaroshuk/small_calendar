var Calendar = function() {

	Date.prototype.getFullDay = function() { //возвращает количество дней в месяце 
		return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
	};

	Date.prototype.getNewMonth = function() { //возвращает название месяца
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		return monthNames[this.getMonth()];
	};

	Date.prototype.getDayOfWeek = function() { //возвращает название дня недели 
		var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

		return dayNames[this.getNewDay()];
	};

	Date.prototype.getNewDay = function() { //получение дня 0(понедельник) - 6 (воскресенье)
		var d = this.getDay();
		if (d === 0) d = 7;
		return d - 1;
	};

	Date.prototype.getFormatDate = function(form) { //возвращение даты в формате строки
		var str;

		if (form) {
			str = form.replace(/[dmy]+/g, function(){
				var str;

				switch (arguments[0]) {
					case "dd": str = this.getDate() < 10 ? "0" + this.getDate(): this.getDate(); break;
					case "ddd": str = ("" + this.getDayOfWeek()).slice(0, 3); break;
					case "dddd": str = this.getDayOfWeek(); break;
					case "mm": str = month = (this.getMonth() + 1) < 10 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1; break;
					case "mmm": str = ("" + this.getNewMonth()).slice(0, 3); break;
					case "mmmm": str = this.getNewMonth(); break;					
					case "yy": str = ("" + this.getFullYear()).slice(2); break;
					case "yyyy": str = this.getFullYear(); break;
					default: str = "????";
				}
				return str;
			}.bind(this));
		}
		else
		{
			var day = this.getDate() < 10 ? "0" + this.getDate(): this.getDate(),
				month = (this.getMonth() + 1) < 10 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1;

			str = day + "-" + month + "-" + this.getFullYear();
		}
		return str;	  
	};



	function Init(year, month, elem) {
		this._year = year;
		this._month = month;
		this._date = new Date(year, this._month);
		this._oldDate;
		this._eventName;
		this._elem = elem;

		this._createCalendar();

		if (this._month === 0) this._table.querySelector(".scArrLeft.scMonthChange").classList.add("hidden");
		if (this._month === 11) this._table.querySelector(".scArrRight.scMonthChange").classList.add("hidden");
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

					this._changeYear("prev");

				} else if (target.classList.contains("scArrRight")) {

					this._changeYear("next");

				}

			} else if (target.classList.contains("scMonthChange")) {

				if (target.classList.contains("scArrLeft")) {

					this._changeMonth("prev");

				} else if (target.classList.contains("scArrRight")) {

					this._changeMonth("next");

				}				

			}

		} else {
			if (target.tagName !== "TD") return;

			var eve = document.createEvent("CustomEvent"); //генерация события "selectDate"
			eve.initCustomEvent("selectDate", true, true, {
				nowDate: new Date(this._year, this._month, +target.innerHTML)
			});
			this._elem.dispatchEvent(eve);
		}

	};

	Init.prototype._changeMonth = function(dir) {
		this._oldDate = this._date;
		this._eventName = "changeMonth";

		switch (dir) {
			case "next": {
				if (this._month < 11) this.setDate(this._year, this._month + 1);
			} break;

			case "prev": {
				if (this._month > 0) this.setDate(this._year, this._month - 1);
			}
		}	
	};

	Init.prototype._changeYear = function(dir) {
		this._oldDate = this._date;
		this._eventName = "changeYear";

		switch (dir) {
			case "next": this.setDate(++this._year, this._month); break;
			case "prev": this.setDate(--this._year, this._month);
		}
	};

	Init.prototype._redrawCalendar = function() {
		this._date = new Date(this._year, this._month);
		this._createCalendar();

		var eve = document.createEvent("CustomEvent");
		eve.initCustomEvent(this._eventName, true, true, {
			nowDate: new Date(this._year, this._month),
			oldDate: new Date(this._oldDate.getFullYear(), this._oldDate.getMonth())
		});

		this._elem.dispatchEvent(eve);

		if (this._month === 0) this._table.querySelector(".scArrLeft.scMonthChange").classList.add("hidden");
		if (this._month === 11) this._table.querySelector(".scArrRight.scMonthChange").classList.add("hidden");
	};

	Init.prototype.setDate = function(year, month) {
		if (month < 0 || month > 11) return;
		this._year = year;
		this._month = month;
		this._redrawCalendar();
	};

	return Init;

}();