import View from './View.js'
import icons from 'url:../../img/icons.svg';  // 但是因為是用parcel啟動的，路徑要加上url



class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _successMessage = 'Recipe was successfully uploaded👌🏻';


    constructor(){
        // super 一定要先寫。 only after that we can use the this keyword
        super();


        // 點擊後會挑出modal
        this._addHandlerShowWindow();


        // 關掉modal，點擊叉叉或點擊視窗模糊處可以把modal關掉
        this._addHandlerHideWindow();
    }


    toggleWindow(){

        // we want take the overlay into window and remove the hidden class
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');  // this one ⬅️ remove the hidden class too.
    }


    // when do we actually want 『 addHandlerShowWindow 』to be called?
    // we want it to be called as soon as the page loads.
    _addHandlerShowWindow(){
        
        // 這裡的bind要記得喔～～
        //『this』keyword inside of a handler func points to the element on which that listener is attached to.
        // 所以要用bind
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    
    // 隱藏視窗
    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }


    // 處理form
    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();


            /*  pretty modern browser API that we can now make use of.
            we can create a new form data and into the form data constructor,
            we have to pass in an element that is a form.
            and so that form in this case is the 『this』keyword

            because we are inside of a handler func, and so 『this』point to this._parentElement
            which is 『 <form class="upload"> 』
            */
            // const dataArray = new FormData(this); // it will return a weird object that we cannot use, we can spread that weird object into an array
            const dataArray = [...new FormData(this)];


            // since ES2019, 一個全新好用的method⬇️，we can use to convert entries to an object
            // 這個『 Object.fromEntries() 』就是『 Object.entries() 』 method的相反，我有寫筆記 ➡️『 Object.entries() 』
            const data = Object.fromEntries(dataArray)


            // 再來要拿這data做什麼呢？？ 我們要把這個data藉由controller.js傳到model.js裡面
            // 因為我們要上傳自己的食譜嘛，肯定跟API有關係，這些都由model.js掌管
            // console.log(data);
            // 藉由從controller.js來的handler把資料傳送到model.js
            handler(data);
        })
    }


    _generateMarkUp(){
        
    }

}

export default new AddRecipeView();