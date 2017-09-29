import './style.css';

const render = require('./list.hbs');
const html = render();

let ul = document.querySelector('#draggableContainer'),
    ulDrop = document.querySelector('#dropContainer'),
    inputLeft = document.querySelector('#input_left'),
    inputRight = document.querySelector('#input_right'),
    selectedItem,
    getFriend,
    getName,
    resParent,
    targetItem = null;

let friendsStorage = {};

let friendsStorageLeft = [],
    friendsStorageRight = [];

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
        return api('users.get', { v: 5.68, name_case: 'gen' });
    })
    .then(data => {
        const [user] = data;

        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100', count: 15 });
    })
    .then(data => {
        const template = render({ list: data.items });
        let getLeftData = JSON.parse(localStorage.leftdata || '[]');
        let getRightData = JSON.parse(localStorage.rightdata || '[]');

        friendsStorage = data.items;

        if (localStorage.length > 1) {
            getLeftData.forEach(item => {
                friendsStorageLeft = getLeftData;
                renderList(item, ul, 'add__icon');
            })

            getRightData.forEach(item => {
                friendsStorageRight = getRightData;
                renderList(item, ulDrop, 'del__icon');
            })
        } else {
            friendsStorageLeft = friendsStorage;
            friendsStorageRight = [];
            ul.innerHTML = template;
        }
    })
    .then(data => {    
        ul.addEventListener('click', (e) => {
            selectedItem = e.target;
            
            if (selectedItem.tagName === 'I') {
                resParent = e.target.parentNode;
                getFriend = resParent.querySelector('.friend__name');

                friendsStorageLeft.forEach(item => {
                    if (isMatching(item.first_name + ' ' + item.last_name, getFriend.innerText)) {
                        addItem(friendsStorageRight, item);
                        removeItem(friendsStorageLeft, item);
                        renderList(item, ulDrop, 'del__icon');
                        ul.removeChild(resParent);
                    }
                });
            }
        });
    })
    .then(data => {
        ulDrop.addEventListener('click', (e) => {
            selectedItem = e.target;

            if (selectedItem.tagName === 'I') {
                resParent = e.target.parentNode;
                getFriend = resParent.querySelector('.friend__name');
                
                friendsStorageRight.forEach(item => {
                    if (isMatching(item.first_name + ' ' + item.last_name, getFriend.innerText)) {
                        addItem(friendsStorageLeft, item);
                        removeItem(friendsStorageRight, item);
                        
                        renderList(item, ul, 'add__icon');
                        ulDrop.removeChild(resParent);
                    }
                });
            }
        });
    })
    .then(data => {
        document.addEventListener('dragstart', (e) => {
            targetItem = e.target;
            e.dataTransfer.setData('text/html', '');
            getName = targetItem;
            getFriend = getName.querySelector('.friend__name');

            friendsStorageLeft.forEach(item => {
                if (isMatching(item.first_name+ ' ' + item.last_name, getFriend.innerText)) {
                    addItem(friendsStorageRight, item);
                    removeItem(friendsStorageLeft, item);
                }
            })
        
            return false;
        });
    })
    .then(data => {          
        document.addEventListener('dragover', (e) => {
            if (targetItem) {
                e.preventDefault();
            }
        
            return false;
        });
    })
    .then(data => {         
        document.addEventListener('drop', (e) => {
            targetItem = e.target;
            let dropTarget = targetItem.querySelector('#dropContainer'),
                changeIcon = getName.querySelector('.item__icon');
        
            if (dropTarget.getAttribute('data-draggable') === 'target') {
                dropTarget.appendChild(getName);
                changeIcon.classList.remove('add__icon');
                changeIcon.classList.add('del__icon');
                e.preventDefault();
            }
        
            return false;
        });
    })
    .then(data => {             
        document.addEventListener('dragend', () => {
            targetItem = null;
            
            return false;
        });
    })
    .then(data => {
        inputLeft.addEventListener('keyup', () => {
            let arr = [];

            ul.innerHTML = '';
            arr = friendsStorageLeft.filter(item => {
                return isMatching(item.first_name +' ' + item.last_name, inputLeft.value);
            })
            
            arr.forEach(item => {
                renderList(item, ul, 'add__icon');
            })
        })
    })
    .then(data => {
        inputRight.addEventListener('keyup', () => {
            let arr = [];

            ulDrop.innerHTML = '';
            arr = friendsStorageRight.filter(item => {
                return isMatching(item.first_name +' ' + item.last_name, inputRight.value);
            })
            
            arr.forEach(item => {
                renderList(item, ulDrop, 'del__icon');
            })
        })
    })
    .then(data => {
        let saveButton = document.querySelector('#saveButton');
        
        saveButton.addEventListener('click', () => {
            if (confirm ('Подтвердите сохранение')) {
                localStorage.leftdata = JSON.stringify(friendsStorageLeft);
                localStorage.rightdata = JSON.stringify(friendsStorageRight);
            } else {
                return;
            }
        })
    })
    .catch((e) => {
        alert('Ошибка: ' + e.message);
    })

function isMatching(full, chunk) {
    return (full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1); 
}

function addItem(array, item) {
    return array.push(item);
}

function removeItem(array, item) {
    const index = array.indexOf(item);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

function renderList(obj, targetList, icon) {
    let li = document.createElement('li');
    
    li.classList.add('friend__item');
    li.setAttribute('data-draggable', 'dragMe');
    li.setAttribute('draggable', 'true');
    li.innerHTML = '<div class="friend_photo__wrapper">'+
                        '<img src="'+obj.photo_100+'" class="image friend__photo" alt="">'+
                    '</div>'+
                    '<div class="friend__name">' + obj.first_name + ' ' + obj.last_name + '</div>'+
                    '<i class="item__icon ' + icon + '"></i>';
    targetList.appendChild(li);
}
