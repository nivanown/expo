/*- calendar -*/
document.addEventListener("DOMContentLoaded", () => {
    const prevArrow = document.querySelector(".calendar__prev-arrow");
    const nextArrow = document.querySelector(".calendar__next-arrow");
    const monthDisplay = document.querySelector(".calendar__month");
    const daysContainer = document.querySelector(".calendar__days");
    const eventsList = document.querySelectorAll(".events-list");

    // Проверяем, есть ли все основные элементы календаря на странице
    if (!prevArrow || !nextArrow || !monthDisplay || !daysContainer || !eventsList.length) {
        console.warn("Не удалось найти некоторые элементы календаря. Проверьте структуру HTML.");
        return; // Завершаем выполнение, если какой-то элемент отсутствует
    }

    let currentDate = new Date(2025, 0); // Начинаем с января 2025
    const today = new Date();
    const initialMonth = today.getMonth();
    const initialYear = today.getFullYear();
    let selectedDates = new Map();

    eventsList.forEach(event => {
        const eventDate = event.getAttribute("data");
        if (eventDate) {
            const [day, month, year] = eventDate.split("/").map(num => parseInt(num, 10));
            const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            selectedDates.set(formattedDate, event);
        }
    });

    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthDisplay.innerHTML = `${getMonthName(month)} <span>${year}</span>`;

        daysContainer.innerHTML = "";
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();
        const nextDays = 42 - (firstDay + lastDate); // 6 недель на сетку

        for (let i = firstDay - 1; i >= 0; i--) {
            const day = document.createElement("span");
            day.classList.add("calendar__day", "disabled");
            day.textContent = prevLastDate - i;
            daysContainer.appendChild(day);
        }

        for (let i = 1; i <= lastDate; i++) {
            const day = document.createElement("span");
            day.classList.add("calendar__day");
            day.textContent = i;

            const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
            
            if (selectedDates.has(dateStr)) {
                day.classList.add("selected");
                day.dataset.date = dateStr;
            }

            // Проверка на прошедшую дату
            if (year < today.getFullYear() || 
                (year === today.getFullYear() && month < today.getMonth()) ||
                (year === today.getFullYear() && month === today.getMonth() && i < today.getDate())) {
                day.classList.add("disabled");
                day.classList.remove("selected"); // Убираем `selected` у прошедших дней
            }

            daysContainer.appendChild(day);
        }

        for (let i = 1; i <= nextDays; i++) {
            const day = document.createElement("span");
            day.classList.add("calendar__day", "disabled");
            day.textContent = i;
            daysContainer.appendChild(day);
        }

        // Блокируем кнопку "назад", если текущий месяц меньше или равен сегодняшнему
        prevArrow.classList.toggle("disabled", year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth()));

        monthDisplay.classList.toggle("text-center", year > initialYear || (year === initialYear && month > initialMonth));

        addDayClickHandlers();

        // **Исправленный авто-переход**
        if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth())) {
            setTimeout(() => {
                currentDate.setMonth(today.getMonth());
                currentDate.setFullYear(today.getFullYear());
                updateCalendar();
            }, 500);
        }
    }

    function addDayClickHandlers() {
        const days = document.querySelectorAll(".calendar__day.selected");
        const calendarWidget = document.querySelector(".calendar-widget");

        if (!days.length || !selectedDates.size || !calendarWidget) return;

        days.forEach(day => {
            day.addEventListener("click", () => {
                const dateStr = day.dataset.date;
                if (!dateStr || !selectedDates.has(dateStr)) return;

                const eventElement = selectedDates.get(dateStr);
                if (!eventElement) return;

                if (day.classList.contains("active")) {
                    day.classList.remove("active");
                    eventElement.classList.remove("show");
                    calendarWidget.classList.remove("open"); // Удаляем `open`, если повторный клик
                } else {
                    document.querySelectorAll(".calendar__day.active").forEach(activeDay => activeDay.classList.remove("active"));
                    document.querySelectorAll(".events-list.show").forEach(event => event.classList.remove("show"));

                    day.classList.add("active");
                    eventElement.classList.add("show");
                    calendarWidget.classList.add("open"); // Добавляем `open`
                }
            });
        });
    }

    function getMonthName(month) {
        const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        return months[month];
    }

    prevArrow.addEventListener("click", () => {
        if (!prevArrow.classList.contains("disabled")) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        }
    });

    nextArrow.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    updateCalendar();
});