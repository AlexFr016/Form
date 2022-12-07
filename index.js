function rerenderCard(storage) {
  users.innerHTML = '';

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    console.log('USER  === ', user);
    console.log('EMAIL === ', email);
    console.log('DATA  === ', userData);

    const div = document.createElement('div');
    div.className = 'user';
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

function getData(e) {
  e.preventDefault();
  const data = {};

  data.name = name.value || '';
  data.secondName = secondName.value || '';
  data.email = email.value || '';

  const key = data.email;
  storage[key] = data;

  localStorage.setItem('users', JSON.stringify(storage));

  rerenderCard(JSON.parse(localStorage.getItem('users')));

  return data;
}

function createCard({ name, secondName, email }) {
  return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${email}</p>
            </div>
            <div class="menu">
                <button data-delete=${email} class="delete redBtn">Удалить</button>
                <button data-change=${email} class="change greenBtn">Применить</button>
            </div>
        </div>
    `;
}

function setListeners() {
  const del = document.querySelectorAll('.delete');
  const change = document.querySelectorAll('.change');
  let clicked;

  del.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('УДАЛИТЬ кнопка');
      console.log('=== NODE:', n);
      clicked = n.getAttribute('data-delete');

      const outer = document.querySelector(`[data-out="${clicked}"]`);
      outer.parentElement.remove();
      delete storage[clicked];
      localStorage.setItem('users', JSON.stringify(storage));

      console.log('=== outer', outer);
    });
  });

  change.forEach((n) => {
    n.addEventListener('click', () => {
      console.log('=== ПРИМЕНИТЬ кнопка');

      clicked = n.getAttribute('data-change');
      name.value = storage[clicked].name;
      secondName.value = storage[clicked].secondName;
      email.value = storage[clicked].email;

      btn.setAttribute('data-change', clicked);
    });
  });
}

function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem('users');
}

function show(el) {
  el.style.display = 'block';
}

function hide(el) {
  el.style.display = 'none';
}

const btn = document.querySelector('.btn');
const clear = document.querySelector('.clear');
let name = document.querySelector('#name');
let secondName = document.querySelector('#secondName');
let email = document.querySelector('#email');
let users = document.querySelector('.users');

// Объект для localStorage
let storage = JSON.parse(localStorage.getItem('users')) || {};

const observer = new MutationObserver((mutations) => {
  if (
    (mutations[0].addedNodes.length || mutations[0].removedNodes.length) &&
    !(mutations.length === 1 && mutations[0].removedNodes.length)
  ) {
    console.log('Карта USERS обновилась');
    setListeners();

    if (btn.getAttribute('data-change')) {
      const key = btn.getAttribute('data-change');
      if (key !== email.value) {
        document.querySelector(`[data-out="${key}"]`).parentElement.remove();
        delete storage[key];
        localStorage.setItem('users', JSON.stringify(storage));
        btn.setAttribute('data-change', '');
      }
    }
  }
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener('click', getData);
clear.addEventListener('click', clearLocalStorage);

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')));
