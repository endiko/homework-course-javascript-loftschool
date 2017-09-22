const render = require('./list.hbs');
const html = render();

function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if (data.error) {
                reject (new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 6192452
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 16);
});

promise
    .then(() => {
        return api('users.get', { v: 5.68, name_case: 'gen'});
    })
    .then(data => {
        const [user] = data;
       // const headerInfo = document.querySelector('#headerInfo');

       // headerInfo.innerText = `Друзья на странице ${user.first_name} ${user.last_name}`;

        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' , count: 3});
    })
    .then(data => {
        const template = render({ list: data.items }),
            res = document.querySelector('#res');

        res.innerHTML = template;
    })
    .catch((e) => {
        alert('Ошибка: ' + e.message);
    })
