/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
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
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    var maxWidth = window.innerWidth,
        maxHeight = window.innerHeight,
        divWidth = randomGenerate(maxWidth), 
        divHeight = randomGenerate(maxHeight),
        divLeft = randomGenerate(maxWidth - divWidth), 
        divTop = randomGenerate(maxHeight - divHeight);

    var newDiv = document.createElement('div');
    
    newDiv.classList.add('draggable-div');
    newDiv.style.width = divWidth + 'px';
    newDiv.style.height = divHeight + 'px';
    newDiv.style.position = 'absolute'; 
    newDiv.style.left = divLeft + 'px';
    newDiv.style.top = divTop + 'px'; 
    newDiv.style.backgroundColor = randomColorBg();

    function randomGenerate (num) {
        return Math.floor(Math.random()*num); 
    } 

    function randomColorBg() {
        var str = '0123456789ABCDEF',
            color = '#';

        for (var i = 0; i < 6; i++) {
            color += str[Math.floor(Math.random() * 16)];
        }

        return color; 
    }

    return newDiv;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    var width = target.style.width.slice(0, -2),
        height = target.style.height.slice(0, -2);

    target.setAttribute('draggable', 'true');
    target.setAttribute('ondragstart', 'event.dataTransfer.setData("text/plain", null)');

    target.parentNode.addEventListener('dragstart', function(e) {
        e.target.style.opacity = .5;
    });
    
    target.parentNode.addEventListener('dragend', function(e) {
        e.target.style.opacity = '';
        e.target.style.left = (e.clientX - width/2) + 'px'; 
        e.target.style.top = (e.clientY - height/2) + 'px';
    });

    target.parentNode.addEventListener('dragenter', function(e) {
        e.preventDefault();
    });

    target.parentNode.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    target.parentNode.addEventListener('dragleave', function(e) {
        if ( e.target.id == 'homework-container' ) {
            e.target.style.background = '';
        }
    });

    target.parentNode.addEventListener('drop', function(e) {
        e.preventDefault();
        if ( e.target.id == 'homework-container' ) {
            e.target.parentNode.removeChild( e.target );
            e.target.appendChild( e.target );
        }
    });

}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
