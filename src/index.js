import './style.css';

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

        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100', count: 15 });
    })
    .then(data => {
        const template = render({ list: data.items }),
            res = document.querySelector('#draggableContainer');

        res.innerHTML = template;
    })
    .catch((e) => {
        alert('Ошибка: ' + e.message);
    })

/* Drag and Drop */

let ul = document.querySelector('#draggableContainer');
let selectedItem,
    targetItem = null;

ul.addEventListener('mousedown', (e) => {
    let targetli = e.target;
    
    while (targetli != ul) {
        if (targetli.tagName == 'LI') {
            highlightItem(targetli);

            return;
        }
        targetli = targetli.parentNode;
    }
});

document.addEventListener('dragstart', (e) => {
    targetItem = e.target;
    e.dataTransfer.setData('text/html', '');
  
    return false;
});
      
document.addEventListener('dragover', (e) => {
    if (targetItem) {
        e.preventDefault();
    }
    
    return false;
});
  
document.addEventListener('drop', (e) => {
    if (e.target.getAttribute('data-draggable') == 'target') {
        e.target.appendChild(targetItem);
        
        e.preventDefault();
    }
    
    return false;
});
      
document.addEventListener('dragend', (e) => {
    targetItem = null;
    
    return false;
});

function highlightItem(node) {
    if (selectedItem) {
        selectedItem.classList.remove('active');
    }

    selectedItem = node;
    selectedItem.classList.add('active');
    
}

