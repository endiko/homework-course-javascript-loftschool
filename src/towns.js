/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status < 400) {
                let list = JSON.parse(xhr.response);
                
                list.sort((itemOne, itemTwo) => {
                    if (itemOne.name > itemTwo.name) {
                        return 1;
                    } else if (itemTwo.name > itemOne.name) {
                        return -1;
                    } 
    
                    return 0;
                });
                
                resolve(list);
            } else {
                reject();
            }
        });   
    });
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1); 
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise = loadTowns();
let reloadBtn = document.createElement('button');

reloadBtn.innerText = 'Повторить';
reloadBtn.style.display = 'none';
homeworkContainer.appendChild(reloadBtn);

window.addEventListener('load', () => {
    townsPromise.then(() => {
        filterBlock.style.display = 'block';
        loadingBlock.style.display = 'none';

    }, () => {
        loadingBlock.innerText = 'Не удалось загрузить города';
        reloadBtn.style.display = 'block';

    })
});

reloadBtn.addEventListener('click', () => {
    townsPromise.then(() => {
        filterBlock.style.display = 'block';
        loadingBlock.style.display = 'none';
        reloadBtn.style.display = 'none';

    }, () => {
        loadingBlock.innerText = 'Не удалось загрузить города';
        reloadBtn.style.display = 'block';

    })
})

filterInput.addEventListener('keyup', function() {
    townsPromise.then(list => {
        let arr = [];
        let res;

        filterResult.innerHTML = '';

        list.forEach((town) => {
            arr.push(`${town.name}`);
        })

        if (filterInput.value === '') {
            filterResult.innerText = '';
        } else {
            res = arr.filter(item => {
                return isMatching(item, filterInput.value);
            });

            for (let i = 0; i < res.length; i++) {
                let elem = document.createElement('div');

                elem.innerText = res[i];
                filterResult.appendChild(elem);
            }
        }
    })   
});

export {
    loadTowns,
    isMatching
};
