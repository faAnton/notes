

if (localStorage.getItem('notes') === null) {
    let object = [];
    localStorage.setItem('notes', JSON.stringify(object))
    // localStorage.setItem('colors', JSON.stringify(object))
}


const MOK_ARRAY = JSON.parse(localStorage.getItem('notes'))
// const MOK_COLORS = JSON.parse(localStorage.getItem('colors'))

window.addEventListener('beforeunload', () => {
    localStorage.setItem('notes', JSON.stringify(model.notes))
    // localStorage.setItem('colors', JSON.stringify(model.colors))
});


// const MOK_ARRAY = [
//     {
//         id: 1, 
//         title: 'Flexbox (CSS)',
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
//         color: '#F3DB7D', 
//         isFavor: false,
//     },
//     {
//         id: 2, 
//         title: 'Объекты (JavaScript)',
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
//         color: '#C2F37D', 
//         isFavor: false,
//     },
//     {
//         id: 3, 
//         title: 'Объекты (JavaScript)',
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor', 
//         color: '#7DE1F3', 
//         isFavor: false,
//     },
//     {
//         id: 4, 
//         title: 'Flexbox (CSS)',
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
//         color: '#F37D7D', 
//         isFavor: false,
//     },
//     {
//         id: 5, 
//         title: 'Объекты (JavaScript)',
//         text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 
//         color: '#E77DF3', 
//         isFavor: false,
//     },
// ];

const MOK_COLORS = [
    {id: 1, color: '#F3DB7D', isSelected: true},
    {id: 2, color: '#C2F37D', isSelected: false},
    {id: 3, color: '#7DE1F3', isSelected: false},
    {id: 4, color: '#F37D7D', isSelected: false},
    {id: 5, color: '#E77DF3', isSelected: false},
];

const model = {
    notes: MOK_ARRAY,
    colors: MOK_COLORS,
    updateStatus(ID, checkboxValue){
        let newArr = this.notes.map((el) =>  el.id === ID ? {...el, isFavor: !el.isFavor} : {...el})
        this.notes = newArr
        checkboxValue ? this.FavoriteNotes(this.notes) : view.render(this.notes)
    },
    deleteNote(ID, checkboxValue) { 
        let newArr = this.notes.filter((el) => el.id !== ID)
        this.notes = newArr
        checkboxValue ? this.FavoriteNotes(this.notes) : view.render(this.notes)
    },
    addNote(title, text, color, checkboxValue) {
        const newNote = {
            id: Math.random(),
            title: title,
            text: text,
            color: color,
            isFavor: false,
        }
        this.notes.unshift(newNote)
        checkboxValue ? this.FavoriteNotes(this.notes) : view.render(this.notes)
    },
    colorSelect(ID){
        let newSelected = this.colors.map((el) => el.id === ID ? {...el, isSelected: true} : {...el, isSelected: false})
        this.colors = newSelected;
        view.colorsRender(this.colors)
    },
    FavoriteNotes(checkboxValue) {
        const FavoriteArray = this.notes.filter(el => el.isFavor === true);
        view.render(FavoriteArray, checkboxValue)
    },
}


const view = {
    init() {
        this.render(model.notes)
        this.colorsRender(model.colors)
        
        const colorsList = document.querySelector('.color-list');
        const notesBlok = document.querySelector('.notes-wrapper'); // элементы в которые рендерим

        const form = document.querySelector('form')
        const inputTitle = document.querySelector('.note-name')
        const textarea = document.querySelector('.note-text') // все что связано с формой

        const FavoriteCheckBox = document.querySelector('.favor-checkbox'); // только избранные (чекбокс)
        
        colorsList.addEventListener('click', (event) => {
            const targetId = +event.target.closest('.color-option').id
            controller.colorSelect(targetId)
        }) // событие на список цветов в форме

        notesBlok.addEventListener('click', (event) => {
            const elemID = +event.target.closest('.note').id
            const targetElement = event.target.className
            if(targetElement === 'heart') {
                let checkboxValue = FavoriteCheckBox.checked
                controller.updateStatus(elemID, checkboxValue)
            }
            if(targetElement === 'trash'){
                let checkboxValue = FavoriteCheckBox.checked
                controller.deleteNote(elemID, checkboxValue)
            }
        }) // событие на элемент (добавить в избранное или удалить)

        form.addEventListener('submit', (event) => {
            event.preventDefault()

            let color = model.colors.find((el) => el.isSelected === true).color
            
            title = inputTitle.value
            text = textarea.value
            
            let controllerAnswer;
            let checkboxValue = FavoriteCheckBox.checked
            controller.addNote(title, text, color, checkboxValue) ? controllerAnswer = true : controllerAnswer = false; 
            // вызываем метод controller'а взависимости от его ответа присваиваем значение переменной
            
            if (controllerAnswer) { // отчищаем поля только если controller возвращает true
                inputTitle.value = '';
                textarea.value = '';
            }
        }) // добавление нового элемента

        FavoriteCheckBox.addEventListener('change', function () {
            controller.FavoriteNotes(this.checked)
        })
    },
    render(noteArr, checkbox = false) {
        this.counter()

        const favorBlock = document.querySelector('.favorite-block');
        const notesBlok = document.querySelector('.notes-wrapper');
    
        if (noteArr.length === 0 && checkbox === false) {
            favorBlock.style.display = 'none'
        }else if (noteArr.length >= 0) {
            favorBlock.style.display = 'flex'
        }

        let notesList = noteArr.length === 0 ? this.clearListMassage(checkbox) : this.createInnerString(noteArr);
        notesBlok.innerHTML = notesList
    },
    createInnerString(noteArr){
        let notesList = ``;
        noteArr.forEach(el => {
            const imgURL = el.isFavor ? './aseets/image/heart-active.svg' : './aseets/image/heart-inactive.svg';
            notesList += `
                <article class="note" id="${el.id}">
                    <div class="note-header" style="background-color: ${el.color}"> 
                        <h2 class="note-title">${el.title}</h2>
                        <div class="note-icons">
                            <img src="${imgURL}" alt="heart" class="heart">
                            <img src="./aseets/image/trash.svg" alt="trash" class="trash">
                        </div>
                    </div>
                    <p class="note-content">${el.text}</p>
                </article>
            `
        });
        return notesList
    },
    clearListMassage(checkbox){ 
        let notesList = ``;
        if (checkbox) {
            notesList = `
                <div class="zero">
                    <p>У вас нет еще ни одной избранной заметки.</p> 
                    <p>Нажмите на иконку с сердечком что бы добавить заметку в избранное.</p>
                </div>
                `
        }else {
            notesList = `
                <div class="zero">
                    <p>У вас нет еще ни одной заметки.</p> 
                    <p>Заполните поля выше и создайте свою первую заметку!</p>
                </div>
            `
        }
        return notesList
    }, // строка в случае пустого массива

    colorsRender(colorsArr) { // рендер списка цветов
        const colorsList = document.querySelector('.color-list');
        let colors = ``;
        colorsArr.forEach(el => {
            colors += `
                <li class='${el.isSelected ? 'color-option selected' : 'color-option'}' id="${el.id}" >
                    <div class="circle" style="background-color: ${el.color}"></div>
                </li>
            `
        })
        colorsList.innerHTML = colors 
    },
    error(errorText) {
        const massageBox = document.querySelector('.massage-box')
        const errorElement = document.createElement('div')
        errorElement.classList.add('error')

        const img = document.createElement('img');
        img.setAttribute('src', './aseets/image/warning.svg')
        img.setAttribute('alt', 'warning')

        const text = document.createElement('p')
        text.textContent = errorText
        
        errorElement.append(img, text)
        massageBox.append(errorElement)
        setTimeout(() => errorElement.remove(), 10000 )
    },
    done() {
        const massageBox = document.querySelector('.massage-box')
        const doneElement = document.createElement('div')
        doneElement.classList.add('done')

        const img = document.createElement('img');
        img.setAttribute('src', './aseets/image/Done.svg')
        img.setAttribute('alt', 'done')

        const text = document.createElement('p')
        text.textContent = 'Заметка добавлена'
        
        doneElement.append(img, text)
        massageBox.append(doneElement)
        setTimeout(() => doneElement.remove(), 10000 )
    },
    counter(){
        const counter = document.querySelector('.count');
        const counterfav = document.querySelector('.count-fav');

        counter.textContent = model.notes.length // количество заметок
        const favoriteLength = model.notes.filter(el => el.isFavor === true).length;
        counterfav.textContent = favoriteLength
    },
}

const controller = {
    addNote(title, text, color, checkboxValue){
        if (title.trim() === '' || text.trim() === '') { // проверка на пустоту
            view.error('Заполните все поля') // вызываем метод и передаем тип ошибки
            return false
        }else {
            if (title.length > 50) { // проверка на длину
                view.error('Максимальная длина заголовка - 50 символов') 
                return false
            }
            model.addNote(title, text, color, checkboxValue)
            view.done()
            return true
        } 
    },
    deleteNote(id, checkboxValue){
        model.deleteNote(id, checkboxValue)
    },
    updateStatus(id, checkboxValue){
        model.updateStatus(id, checkboxValue)
    },
    colorSelect(id) {
        model.colorSelect(id)
    },
    FavoriteNotes(status) {
        status ? model.FavoriteNotes(status) : view.render(model.notes)
    },
}


view.init()