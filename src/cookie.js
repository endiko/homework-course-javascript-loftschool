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

// let allCookies,
//     arr = [];

let cookiesStorage = {};

let cookieName,
    cookieVal,
    filterName;

window.addEventListener('load', () => {
   // cookiesStorage = getCookies();

    renderTable(cookiesStorage);

    // allCookies = document.cookie.split('; ');
    // allCookies.forEach(cookie => arr.push(cookie.split('=')));

    // for (let i = 0; i < arr.length; i++) {
    //     let tr = document.createElement('tr');

    //     tr.innerHTML = '<td>'+arr[i][0]+'</td><td>'+arr[i][1]+'</td><td><button>Удалить</button></td>';
    //     listTable.appendChild(tr);

    //     let delButton = tr.querySelector('button');
        
    //     delButton.addEventListener('click', (e) => {
    //         deleteCookie(e.target.parentNode.parentNode.firstElementChild.innerText);
    //         e.target.parentNode.parentNode.remove('tr');
    //     });
    // }
});

filterNameInput.addEventListener('keyup', function() {
    filterName = filterNameInput.value;

    let arrValues = Object.values(cookiesStorage);
    let arrKeys = Object.keys(cookiesStorage);

    let newCookieStorage = {};

    let resKeys = arrKeys.filter(item => {
        return isMatching(item, filterName);
    });

    let resValues = arrValues.filter(item => {
        return isMatching(item, filterName);
    });

    console.log(resKeys, resValues);
});

addButton.addEventListener('click', () => {
    cookieName = addNameInput.value,
    cookieVal = addValueInput.value;

    for (let key in cookiesStorage) {
        if (key == cookieName) {
            updateTable(cookiesStorage, key, cookieVal);
        } else {
            createCookie(cookieName, cookieVal);
        }
    }

    renderTable(cookiesStorage);

//     let tr = document.createElement('tr');

//     let cookieObj = listTable.querySelectorAll('tr');

//    // console.log(cookieObj);

//     for (let i=0; i< cookieObj.length; i++) {
        
//         if (cookieObj[i].firstElementChild.innerText !== cookieName) {
//             createCookie(cookieName, cookieVal);
//         } else {
//             cookieObj[i].children[1].innerText = cookieVal;
//         }
//     }
    
//     tr.innerHTML = '<td>'+cookieName+'</td><td>'+cookieVal+'</td><td><button>Удалить</button></td>';
//     listTable.appendChild(tr);

//     let delButton = tr.querySelector('button');

//     delButton.addEventListener('click', (e) => {
//         deleteCookie(e.target.parentNode.parentNode.firstElementChild.innerText);
//         e.target.parentNode.parentNode.remove('tr');
//     });
});

function getCookies() {
    let cookies = document.cookie.split('; ');

    cookies.forEach(cookie => { 
        let val = cookie.split('=');
        
        cookiesStorage[val[0]] = val[1];
    });

    return cookiesStorage;
}

function renderTable(obj) {
    listTable.innerHTML = '';
    obj = getCookies();

    for (let key in obj) {
        let tr = document.createElement('tr');

        tr.innerHTML = '<td>'+key+'</td><td>'+obj[key]+'</td><td><button>Удалить</button></td>';
        listTable.appendChild(tr);
    }
    
    listTable.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            deleteCookie(e.target.parentNode.parentNode.firstElementChild.innerText);
            e.target.parentNode.parentNode.remove('tr');
        }
        
    });
}

function updateTable(obj, objKey, newVal) {
    obj[objKey] = newVal;
    createCookie(objKey, obj[objKey]);
}

function createCookie (name, value) {
    let date = new Date();

    date.setYear(2018);

    return document.cookie = name+'='+value+'; expires='+date.toString();
}

function deleteCookie (name) {
    let date = new Date(0);
    
    return document.cookie = name+'= '+'; expires='+date.toString();
}

function isMatching(full, chunk) {
    return (full.indexOf(chunk) !== -1); 
}