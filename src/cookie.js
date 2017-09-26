/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container'),
    filterNameInput = homeworkContainer.querySelector('#filter-name-input'),
    addNameInput = homeworkContainer.querySelector('#add-name-input'),
    addValueInput = homeworkContainer.querySelector('#add-value-input'),
    addButton = homeworkContainer.querySelector('#add-button'),
    listTable = homeworkContainer.querySelector('#list-table tbody');

let cookiesStorage = {};

window.addEventListener('load', () => {
    getCookies();    
    renderTable(cookiesStorage);
});

filterNameInput.addEventListener('keyup', function() {
    if (filterNameInput.value) {
        cookiesStorage = {};
        getCookies();
        renderFiltered();
    } else {
        cookiesStorage = {};
        getCookies();
        renderTable(cookiesStorage);
    }
    
});

addButton.addEventListener('click', () => {

    let cookieName = addNameInput.value,
        cookieVal = addValueInput.value;

    cookiesStorage[cookieName] = cookieVal;

    createCookie(cookieName, cookieVal);
    renderFiltered();
});

function getCookies() {
    if (document.cookie === '') {
        return;
    }
    let cookies = document.cookie.split('; ');
    
    cookies.forEach(cookie => { 
        let val = cookie.split('=');
        
        cookiesStorage[val[0]] = val[1];
    });
}

function renderTable(obj) {
    listTable.innerHTML = '';
    for (let key in obj) {
        let tr = document.createElement('tr');

        if (key !== '' && obj[key] !== 'undefined') {
            tr.innerHTML = '<td>'+key+'</td><td>'+obj[key]+'</td><td><button>Удалить</button></td>';
            listTable.appendChild(tr);
        } 
    }
    
    listTable.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            let key = e.target.parentNode.parentNode.firstElementChild.innerText;

            delete cookiesStorage[key];
            deleteCookie(key);
            renderFiltered();
        }
    });
}

function renderFiltered() {
    let filterValue = filterNameInput.value;

    if (filterValue === '') {
        renderTable(cookiesStorage);

        return;
    }

    let newObj = {};
    let arrValues = Object.values(cookiesStorage);
    let arrKeys = Object.keys(cookiesStorage);

    let resKeys = arrKeys.filter(item => {
        return isMatching(item, filterValue);
    });

    let resValues = arrValues.filter(item => {
        return isMatching(item, filterValue);
    });

    for (let key in cookiesStorage) {
        for (let i = 0; i < resKeys.length; i++) {
            if (resKeys[i] == key) {
                newObj[resKeys[i]] = cookiesStorage[key];
            }
        }
        for (let i = 0; i < resValues.length; i++) {
            if (resValues[i] == cookiesStorage[key]) {
                newObj[key] = resValues[i];
            }
        }
    }
    renderTable(newObj);
}

function createCookie (name, value) {
    let date = new Date();

    date.setYear(2018);
    document.cookie = name+'='+value+'; expires='+date.toString();
}

function deleteCookie (name) {
    let date = new Date(0);
    
    document.cookie = name+'= '+'; expires='+date.toString();
}

function isMatching(full, chunk) {
    return (full.indexOf(chunk) !== -1); 
}