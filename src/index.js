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

let leftArr = [],
    rightArr = [];

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

        ul.innerHTML = template;
        friendsStorage = data.items;
    })
    .then(data => {
        document.addEventListener('dragstart', (e) => {
            targetItem = e.target;
            e.dataTransfer.setData('text/html', '');
            getName = targetItem;

            getFriend = getName.querySelector('.friend__name');

            leftArr.forEach(item => {
                if (isMatching(item.first_name+ ' ' + item.last_name, getFriend.innerText)) {
                    addItem(rightArr, item);
                    removeItem(leftArr, item);
                }
            })
        
            return false;
        });
              
        document.addEventListener('dragover', (e) => {
            if (targetItem) {
                e.preventDefault();
            }
        
            return false;
        });
          
        document.addEventListener('drop', (e) => {
            targetItem = e.target;
            let dropTarget = targetItem.querySelector('#dropContainer'),
                changeIcon = getName.querySelector('.item__icon');
        
            changeIcon.classList.remove('add__icon');
            changeIcon.classList.add('del__icon');
        
            if (dropTarget.getAttribute('data-draggable') == 'target') {
                dropTarget.appendChild(getName);
                e.preventDefault();
            }
        
            return false;
        });
              
        document.addEventListener('dragend', () => {
            targetItem = null;
            
            return false;
        });
    })
    .then(data => {
        leftArr = friendsStorage;

        ul.addEventListener('click', (e) => {
            selectedItem = e.target;
            
            if (selectedItem.tagName === 'I') {
                resParent = e.target.parentNode;
                getFriend = resParent.querySelector('.friend__name');

                leftArr.forEach((item) => {
                    if (isMatching(item.first_name + ' ' + item.last_name, getFriend.innerText)) {
                        addItem(rightArr, item);
                        removeItem(leftArr, item);
                        renderList(item, ulDrop, 'del__icon');
                        ul.removeChild(resParent);
                    }
                });
            }

            ulDrop.addEventListener('click', (e) => {
                selectedItem = e.target;
                
                if (selectedItem.tagName === 'I') {
                    resParent = e.target.parentNode;
                    getFriend = resParent.querySelector('.friend__name');
    
                    rightArr.forEach((item) => {
                        if (isMatching(item.first_name + ' ' + item.last_name, getFriend.innerText)) {
                            addItem(leftArr, item);
                            removeItem(rightArr, item);
                            
                            renderList(item, ul, 'add__icon');
                            ulDrop.removeChild(resParent);
                        }
                    });
                }
            });
        });
    })
    .then(data => {
        let arr = [];

        inputLeft.addEventListener('keyup', () => {
            ul.innerHTML = '';
            arr = leftArr.filter(item => {
                return isMatching(item.first_name +' ' + item.last_name, inputLeft.value);
            })
            
            arr.forEach(item => {
                renderList(item, ul, 'add__icon');
            })
        })

        inputRight.addEventListener('keyup', () => {
            ulDrop.innerHTML = '';
            arr = rightArr.filter(item => {
                return isMatching(item.first_name +' ' + item.last_name, inputRight.value);
            })
            
            arr.forEach(item => {
                renderList(item, ulDrop, 'del__icon');
            })
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
