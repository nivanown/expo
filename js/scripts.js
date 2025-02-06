/*- header -*/
let lastScrollTop = 0;
const header = document.querySelector(".header");
const scrollThreshold = 0; // Измените значение для настройки порога

window.addEventListener("scroll", () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > scrollThreshold && scrollTop > lastScrollTop) {
        // Добавляем класс при достижении порога и прокрутке вниз
        header.classList.add("fixed");
        header.classList.remove("no-fixed");
    } else if (scrollTop < lastScrollTop) {
        // Удаляем fixed и добавляем no-fixed при прокрутке вверх
        header.classList.remove("fixed");
        header.classList.add("no-fixed");
    }
    
    // Удаляем no-fixed при достижении самого верха
    if (scrollTop <= 300) {
        header.classList.remove("no-fixed");
    }
    
    lastScrollTop = scrollTop;
});

/*- language -*/
const languageFlag = document.querySelector('.language__flag');
const languageDropdown = document.querySelector('.language__dropdown');
const languageBlock = document.querySelector('.language');

// Проверяем, существуют ли элементы на странице
if (languageFlag && languageDropdown && languageBlock) {
    // Функция для переключения классов
    function toggleLanguageMenu(event) {
        // Останавливаем всплытие события, чтобы избежать закрытия при клике внутри блока
        event.stopPropagation();
        languageFlag.classList.toggle('open');
        languageDropdown.classList.toggle('show');
    }

    // Функция для закрытия меню
    function closeLanguageMenu() {
        languageFlag.classList.remove('open');
        languageDropdown.classList.remove('show');
    }

    // Вешаем обработчик на флаг
    languageFlag.addEventListener('click', toggleLanguageMenu);

    // Закрываем меню при клике вне блока
    document.addEventListener('click', (event) => {
        if (!languageBlock.contains(event.target)) {
            closeLanguageMenu();
        }
    });
}

/*- catalog -*/
const catalogBtn = document.querySelector('.catalog__btn');
const catalogDropdown = document.querySelector('.catalog__dropdown');
const catalogBlock = document.querySelector('.catalog');
const catalogOverlay = document.querySelector('.catalog-overlay');
const closeBtn = document.querySelector('.catalog .close-btn');

// Проверяем, существуют ли элементы на странице
if (catalogBtn && catalogDropdown && catalogBlock && catalogOverlay) {
    // Функция для переключения классов
    function toggleCatalogMenu(event) {
        event.stopPropagation();
        const isOpen = catalogBtn.classList.toggle('open');
        catalogDropdown.classList.toggle('show', isOpen);
        catalogOverlay.classList.toggle('show', isOpen);
        document.body.classList.toggle('scroll-none', isOpen);
    }

    // Функция для закрытия меню
    function closeCatalogMenu() {
        catalogBtn.classList.remove('open');
        catalogDropdown.classList.remove('show');
        catalogOverlay.classList.remove('show');

        // Удаляем scroll-none только если оба dropdown скрыты
        if (!catalogDropdown.classList.contains('show') && !document.querySelector('.search-form__dropdown.show')) {
            document.body.classList.remove('scroll-none');
        }
    }

    // Вешаем обработчик на кнопку
    catalogBtn.addEventListener('click', toggleCatalogMenu);

    // Закрываем меню при клике вне блоков
    document.addEventListener('click', (event) => {
        if (
            !event.target.closest('.catalog') &&
            !event.target.closest('.catalog__dropdown')
        ) {
            closeCatalogMenu();
        }
    });

    // Закрываем меню при клике на кнопку закрытия
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCatalogMenu);
    }
}

/*- catalog-tabs -*/
document.addEventListener('DOMContentLoaded', () => {
    const tabNavItems = document.querySelectorAll('.catalog-tabs__nav li');
    const tabContentItems = document.querySelectorAll('.catalog-tabs__item');

    tabNavItems.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Убираем класс active у всех элементов навигации
            tabNavItems.forEach(navItem => navItem.classList.remove('active'));
            // Убираем класс active у всех элементов контента
            tabContentItems.forEach(contentItem => contentItem.classList.remove('active'));

            // Добавляем класс active текущему элементу навигации
            tab.classList.add('active');
            // Добавляем класс active соответствующему элементу контента
            tabContentItems[index].classList.add('active');
        });
    });
});

/*- search-form -*/
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-form__input");
    const searchDropdown = document.querySelector(".search-form__dropdown");
    const searchOverlay = document.querySelector(".search-form-overlay");
    const searchForm = document.querySelector(".search-form");
    const searchItems = document.querySelectorAll(".search-result__item");
    const body = document.body;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();

        // Условие: Показывать результаты только если введено 2 или более символов
        if (query.length < 2) {
            removeSearchClasses();
            return;
        }

        let hasMatches = false;

        searchItems.forEach(item => {
            // Найти все элементы с текстом для проверки: <dt>, <a>, .search-result__location
            const textElements = item.querySelectorAll("dt, a, .search-result__location");
            let itemMatches = false;

            textElements.forEach(el => {
                const originalText = el.textContent;
                const lowerText = originalText.toLowerCase();

                if (lowerText.startsWith(query)) {
                    itemMatches = true;
                    hasMatches = true;

                    // Обернуть совпадающий текст в <strong>
                    const highlightedText = originalText.replace(
                        new RegExp(`^(${query})`, "i"),
                        "<strong>$1</strong>"
                    );
                    el.innerHTML = highlightedText;
                } else {
                    // Вернуть оригинальный текст
                    el.innerHTML = originalText;
                }
            });

            // Показать или скрыть элемент
            item.style.display = itemMatches ? "block" : "none";
        });

        // Управление классами dropdown, overlay и body
        if (hasMatches) {
            searchDropdown.classList.add("show");
            searchOverlay.classList.add("show");
            body.classList.add("scroll-none");
        } else {
            removeSearchClasses();
        }
    });

    // Удаление классов при клике вне поиска и dropdown
    document.addEventListener("click", (event) => {
        if (
            !event.target.closest(".search-form") &&
            !event.target.closest(".search-form__dropdown")
        ) {
            removeSearchClasses();
        }
    });

    function removeSearchClasses() {
        searchDropdown.classList.remove("show");
        searchOverlay.classList.remove("show");
        searchItems.forEach(item => (item.style.display = "none"));

        // Удаляем scroll-none только если оба dropdown скрыты
        if (!searchDropdown.classList.contains('show') && !document.querySelector('.catalog__dropdown.show')) {
            body.classList.remove("scroll-none");
        }
    }
});

/*- partners-slider -*/
var swiper = new Swiper(".partners-slider__in", {
    autoplay: false,
    autoHeight: true,
    loop: false,
    slidesPerView: 8,
    slidesPerGroup: 8,
    spaceBetween: 20,
    navigation: {
        nextEl: ".partners-slider .swiper-button-next",
        prevEl: ".partners-slider .swiper-button-prev",
    },
    breakpoints: {
    0: {
        slidesPerView: "auto",
        slidesPerGroup: true,
        spaceBetween: 20,
        },
    961: {
        slidesPerView: 8,
        slidesPerGroup: 8,
        spaceBetween: 20,
        },
    },
});

/*- select -*/
const selects = document.querySelectorAll('.select');
const inputs = document.querySelectorAll('.select-hidden-form input'); // Получаем все input

// Функция для закрытия всех open/show классов
function closeAllSelects(exceptSelect) {
    selects.forEach(select => {
        if (select !== exceptSelect) {
            const selectText = select.querySelector('.select__text');
            const selectDropdown = select.querySelector('.select__dropdown');
            select.classList.remove('open'); // Удаляем класс open у select
            selectText.classList.remove('open');
            selectDropdown.classList.remove('show');
        }
    });
}

// Функция для переноса данных из select__text в input
function syncSelectWithInput() {
    selects.forEach((select, index) => {
        const input = inputs[index]; // Соответствующий input
        const selectText = select.querySelector('.select__text');

        // Перенос текста в input
        if (input && selectText) {
            input.value = selectText.textContent;
        }
    });
}

// Обрабатываем каждый select
selects.forEach(select => {
    const selectText = select.querySelector('.select__text');
    const selectDropdown = select.querySelector('.select__dropdown');
    const listItems = select.querySelectorAll('.select__dropdown li');

    // Функция для переключения классов на .select и .select__dropdown
    selectText.addEventListener('click', (event) => {
        event.stopPropagation(); // Останавливаем всплытие, чтобы клик по select не закрывал его

        // Если меню открыто, закрываем его, если нет — открываем
        const isOpen = select.classList.contains('open');
        closeAllSelects(select); // Закрываем все другие select
        if (!isOpen) {
            select.classList.add('open'); // Добавляем класс open к select
            selectText.classList.add('open');
            selectDropdown.classList.add('show');
        } else {
            select.classList.remove('open'); // Удаляем класс open у select
            selectText.classList.remove('open');
            selectDropdown.classList.remove('show');
        }
    });

    // Функция для обновления текста и класса active на <li>
    listItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие, чтобы клик по <li> не закрывал select

            // Убираем класс active со всех элементов <li>
            listItems.forEach(li => li.classList.remove('active'));

            // Добавляем класс active к текущему выбранному элементу
            item.classList.add('active');

            // Обновляем текст в .select__text
            selectText.textContent = item.textContent;

            // Перенос данных в input
            syncSelectWithInput();

            // Закрываем выпадающее меню
            select.classList.remove('open'); // Удаляем класс open у select
            selectText.classList.remove('open');
            selectDropdown.classList.remove('show');
        });
    });

    // Закрытие меню при клике на любую область страницы, кроме текущего select
    document.addEventListener('click', (event) => {
        if (!select.contains(event.target)) {
            select.classList.remove('open'); // Удаляем класс open у select
            selectText.classList.remove('open');
            selectDropdown.classList.remove('show');
        }
    });
});

// Инициализируем начальные значения input
syncSelectWithInput();

/*- accordion -*/
const accordions = document.querySelectorAll('.accordion__title-panel');

accordions.forEach(accordion => {
    accordion.addEventListener('click', function () {
        // Тогглинг класса active для заголовка
        this.classList.toggle('active');

        // Получение родительского элемента accordion__item
        const accordionItem = this.closest('.accordion__item');
        if (accordionItem) {
            accordionItem.classList.toggle('open');
        }

        // Работа с maxHeight для панели
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
});

/*- input-mail -*/
document.addEventListener('DOMContentLoaded', () => {
    const inputMail = document.querySelector('.input-mail');

    if (!inputMail) {
        console.warn('Элемент с классом "input-mail" не найден на странице.');
    return;
    }

    inputMail.addEventListener('input', () => {
        const value = inputMail.value;
        const hasCyrillic = /[а-яё]/i.test(value);

        if (hasCyrillic) {
            inputMail.classList.add('error-field');
            inputMail.value = value.replace(/[а-яё]/gi, ''); // Убираем кириллицу
        } else {
            inputMail.classList.remove('error-field');
        }
    });
});

/*- company-info -*/
document.addEventListener('DOMContentLoaded', function () {
    const companyInfo = document.querySelector('.company-info');

    if (!companyInfo) {
        // Блок company-info отсутствует, ничего не делаем
        return;
    }

    const paragraphs = companyInfo.querySelectorAll('p');
    const linkShow = companyInfo.querySelector('.company-info__link-show');
    const linkHidden = companyInfo.querySelector('.company-info__link-hidden');

    // Если на странице только один тег <p>, скрываем кнопку "Показать все"
    if (paragraphs.length <= 1) {
        linkShow.classList.add('hidden');
        return; // Прерываем выполнение, так как остальные действия не нужны
    }

    // Изначально скрываем все теги <p>, кроме первого
    paragraphs.forEach((p, index) => {
        if (index !== 0) {
            p.classList.add('hidden');
        }
    });

    // Добавляем обработчик для кнопки "Показать все"
    linkShow.addEventListener('click', () => {
        paragraphs.forEach(p => p.classList.remove('hidden'));
        linkShow.classList.add('hidden');
        linkHidden.classList.add('show');
    });

    // Добавляем обработчик для кнопки "Скрыть"
    linkHidden.addEventListener('click', () => {
        paragraphs.forEach((p, index) => {
            if (index !== 0) {
                p.classList.add('hidden');
            }
        });
        linkShow.classList.remove('hidden');
        linkHidden.classList.remove('show');
    });
});

/*- mobile-menu -*/
document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector(".menu-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const closeBtn = document.querySelector(".mobile-menu__close");
    const overlay = document.querySelector(".mobile-menu-overlay");
    const body = document.body;

    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.add("open");
        overlay.classList.add("show");
        body.classList.add("m-scroll-none");
    });

    function closeMenu() {
        mobileMenu.classList.remove("open");
        overlay.classList.remove("show");
        body.classList.remove("m-scroll-none");
    }

    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
});

/*- mobile-language -*/
document.addEventListener("DOMContentLoaded", function () {
    const languageText = document.querySelector(".mobile-language__text");
    const languageList = document.querySelector(".mobile-language-list");
    
    if (languageText && languageList) {
        languageText.addEventListener("click", function (event) {
            event.stopPropagation();
            languageText.classList.toggle("open");
            languageList.classList.toggle("show");
        });
        
        document.addEventListener("click", function (event) {
            if (!languageText.contains(event.target) && !languageList.contains(event.target)) {
                languageText.classList.remove("open");
                languageList.classList.remove("show");
            }
        });
    }
});

/*- footer__nav -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".footer__title").forEach(title => {
        title.addEventListener("click", () => {
            title.classList.toggle("active");
            const nav = title.nextElementSibling;
            if (nav && nav.classList.contains("footer__nav")) {
                nav.classList.toggle("show");
            }
        });
    });
});

/*- share -*/
document.addEventListener("DOMContentLoaded", () => {
    const icon = document.querySelector(".share__icon");
    const dropdown = document.querySelector(".share__dropdown");

    if (icon && dropdown) {

        function toggleDropdown(event) {
            event.stopPropagation();
            dropdown.classList.toggle("show");
            icon.classList.toggle("active");
        }

        function closeDropdown(event) {
            if (!dropdown.contains(event.target) && !icon.contains(event.target)) {
                dropdown.classList.remove("show");
                icon.classList.remove("active");
            }
        }

        icon.addEventListener("click", toggleDropdown);
        document.addEventListener("click", closeDropdown);
    }
});

/*- dates -*/
document.addEventListener("DOMContentLoaded", function () {
    const datesWidget = document.getElementById("dates");
    if (!datesWidget) return;

    const listItems = datesWidget.querySelectorAll(".filters-widget__list li");
    const showMoreBtn = datesWidget.querySelector(".filters-widget__link-show");
    const hideBtn = datesWidget.querySelector(".filters-widget__link-hidden");

    listItems.forEach((li, index) => {
        if (index >= 5) {
            li.classList.add("hidden");
        }
    });

    showMoreBtn.addEventListener("click", function () {
        listItems.forEach(li => li.classList.remove("hidden"));
        showMoreBtn.classList.add("hidden");
        hideBtn.classList.add("show");
    });

    hideBtn.addEventListener("click", function () {
        listItems.forEach((li, index) => {
            if (index >= 5) {
                li.classList.add("hidden");
            }
        });
        showMoreBtn.classList.remove("hidden");
        hideBtn.classList.remove("show");
    });
});

/*- modal -*/
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-modal]").forEach(trigger => {
        trigger.addEventListener("click", (e) => {

            if (trigger.tagName.toLowerCase() === "a") {
                e.preventDefault();
            }

            const modalId = trigger.getAttribute("data-modal");
            const modal = document.getElementById(modalId);

            if (modal) {
                document.body.classList.add("modal-scroll-none");
                modal.classList.add("show");
            }
        });
    });

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            const modalIn = modal.querySelector(".modal__in");

            if (
                e.target.classList.contains("modal__close-btn") || 
                e.target.classList.contains("modal__overlay") || 
                (modalIn && !modalIn.contains(e.target))
            ) {
                modal.classList.remove("show");
                document.body.classList.remove("modal-scroll-none");
            }
        });
    });
});
