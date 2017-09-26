import './style.css';

const render = require('./list.hbs'); 
const html = render();

let friendsStorage = [];

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

        // friendsStorage = data.items;
        // let arr = [];
        // console.log(friendsStorage);

        // friendsStorage.forEach((item) => {
        //     for(let key in item) {
        //         console.log(key, item[key]);
        //     }
        //     //console.log(item.first_name, item.last_name, item.photo_100);
        // })
    })
    .catch((e) => {
        alert('Ошибка: ' + e.message);
    })

/* Drag and Drop */

let ul = document.querySelector('#draggableContainer');
let ulDrop = document.querySelector('#dropContainer');

let selectedItem,
    targetItem = null;

let getName;

ul.addEventListener('click', (e) => {
    selectedItem = e.target;

    let res;

    if (selectedItem.tagName === 'I') {
        res = e.target.parentNode;
        let getPhoto = res.querySelector('.friend__photo');
        let getFriend = res.querySelector('.friend__name');

        ulDrop.innerHTML = '<li class="friend__item">'+
        '<div class="friend_photo__wrapper">'+
            '<img src="'+getPhoto.src+'" class="image friend__photo" alt="">'+
        '</div>'+
        '<div class="friend__name">'+
            getFriend.innerText+
        '</div>'+
        '<i class="item__icon del__icon"></i></li>'
    }
});

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
    getName = targetItem;

    return false;
});
      
document.addEventListener('dragover', (e) => {
    if (targetItem) {
        e.preventDefault();
    }

    return false;
});
  
document.addEventListener('drop', (e) => {
    //console.log(getName);
    targetItem = e.target;
    let dropTarget = targetItem.querySelector('#dropContainer');

    if (dropTarget.getAttribute('data-draggable') == 'target') {
        dropTarget.appendChild(getName);
        
        e.preventDefault();
    }
    
    return false;
});
      
document.addEventListener('dragend', (e) => {
    //console.log(friendsStorage);
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

