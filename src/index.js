/* ДЗ 7.1 - BOM */

/**
 * Функция должна создавать окно с указанным именем и размерами
 *
 * @param {number} name - имя окна
 * @param {number} width - ширина окна
 * @param {number} height - высота окна
 * @return {Window}
 */
function createWindow(name, width, height) {
    return window.open('', 'name', 'width = width, height = height');
}

/**
 * Функция должна закрывать указанное окно
 *
 * @param {Window} window - окно, размер которого надо изменить
 */
function closeWindow(window) {
    return window.close(window);
}

/**
 * Функция должна создавать cookie с указанными именем и значением
 *
 * @param name - имя
 * @param value - значение
 */
function createCookie(name, value) {
    let date = new Date();

    date.setYear(2018);

    return document.cookie = name+'='+value+'; expires='+date.toString();
}

/**
 * Функция должна удалять cookie с указанным именем
 *
 * @param name - имя
 */
function deleteCookie(name) {
    let date = new Date(0);
    
    return document.cookie = name+'= '+'; expires='+date.toString();
}

export {
    createWindow,
    closeWindow,
    createCookie,
    deleteCookie
};
