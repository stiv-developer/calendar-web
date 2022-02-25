class Calendar {
    constructor(id) {
        this.cells = [];
        this.selectedDate = null;
        this.currentMonth = moment();
        this.elCalendar = document.getElementById(id);
        this.showTemplate();
        this.elGridBody = this.elCalendar.querySelector('.grid__body');
        this.elMonthName = this.elCalendar.querySelector('.month-name');
        this.showCells();
    }

    showTemplate() {
        this.elCalendar.innerHTML = this.getTemplate();
        this.addEventListenerToControls();
    }

    getTemplate() {
        let template = `
        <div class="group">
                <p class="month-name">Febrero 2022</p>
                <div class="group__icon">
                    <i class="fa fa-angle-left icon control control--prev"></i>
                    <i class="fa fa-circle icon"></i>
                    <i class="fa fa-angle-right control control--next"></i>
                </div>
            </div>
            <div class="calendar__body">
                <div class="grid">
                    <div class="grid__header">
                        <span class="grid__cell grid__cell--gh">LUNES</span>
                        <span class="grid__cell grid__cell--gh">MARTES</span>
                        <span class="grid__cell grid__cell--gh">MIERCOLES</span>
                        <span class="grid__cell grid__cell--gh">JUEVES</span>
                        <span class="grid__cell grid__cell--gh">VIERNES</span>
                        <span class="grid__cell grid__cell--gh">SABADO</span>
                        <span class="grid__cell grid__cell--gh">DOMINGO</span>
                    </div>
                    <div class="grid__body"></div>
                </div>
            </div>
        `;
        return template;
    }

    addEventListenerToControls() {
        let elControls = this.elCalendar.querySelectorAll('.control');
        elControls.forEach(elControl => {
            elControl.addEventListener('click', e => {
                let elTarget = e.target;
                let next = false;
                if (elTarget.classList.contains('control--next')) {
                    next = true
                }
                this.changeMonth(next)
                this.showCells();
            });
        });
    }

    changeMonth(next = true) {
        if (next) {
            this.currentMonth.add(1, 'months')
        } else {
            this.currentMonth.subtract(1, 'months')
        }
    }

    showCells() {
        this.cells = this.generateDates(this.currentMonth);
        if (this.cells === null) {
            console.error('No fue posible generar las fechas del calendario')
            return;
        }

        this.elGridBody.innerHTML = '';
        let templateCells = '';
        let disabledClass = '';
        for (let i = 0; i < this.cells.length; i++) {
            disabledClass = '';
            if (!this.cells[i].isInCurrentMonth) {
                disabledClass = 'grid__cell--disabled';
            }
            templateCells += `
            <span class="grid__cell grid__cell--gd ${disabledClass}" data-cell-id="${i}">${this.cells[i].date.date()}</span>
            `
        }

        this.elMonthName.innerHTML = this.currentMonth.format('MMMM YYYY')
        this.elGridBody.innerHTML = templateCells;
        this.addEventListenerToCells();
    }
    generateDates(monthToShow = moment()) {
        if (!moment.isMoment(monthToShow)) {
            return null;
        }
        let dateStart = moment(monthToShow).startOf('month');
        let dateEnd = moment(monthToShow).endOf('month')
        let cells = [];

        // ENCONTRAR LA PRIMER FECHA QUE SE VA A MOSTRAR EN 
        // CALENDARIO
        while (dateStart.day() !== 1) {
            dateStart.subtract(1, 'days')
        }

        // ENCONTRAR LA ULTIMA FECHA QUE SE VA A MOSTRAR EN EL CALENDARIO
        while (dateEnd.day() !== 0) {
            dateEnd.add(1, 'days')
        }


        // GENERA LAS FECHAS DE GRID
        do {
            cells.push({
                date: moment(dateStart),
                isInCurrentMonth: dateStart.month() === monthToShow.month()

            });
            dateStart.add(1, 'days')
        } while (dateStart.isSameOrBefore(dateEnd));

        return cells;
    }
    addEventListenerToCells() {
        let elCells = this.elCalendar.querySelectorAll('.grid__cell--gd');
        elCells.forEach(elCell => {
            elCell.addEventListener('click', e => {
                let elTarget = e.target;
                if (elTarget.classList.contains('grid__cell--disabled') ||
                    elTarget.classList.contains('grid__cell--selected')) {
                    return
                }
                // DESELECCIONAR LA CELDA ANTERIOR
                let selectedCell = this.elGridBody.querySelector('.grid__cell--selected');
                if (selectedCell) {
                    selectedCell.classList.remove('grid__cell--selected');
                }
                // SELECCIONAR LA NUEVA SELDA
                elTarget.classList.add('grid__cell--selected')
                this.selectedDate = this.cells[parseInt(elTarget.dataset.cellId)].date;
                // Lanzar evento change
                this.elCalendar.dispatchEvent(new Event('change'));
            })
        })
    }
    getElement() {
        return this.elCalendar;
    }

    value() {
        return this.selectedDate;
    }
}