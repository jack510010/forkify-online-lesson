import icons from 'url:../../img/icons.svg';  // 但是因為是用parcel啟動的，路徑要加上url

import View from './View.js'


class RecipeView extends View{
    // 為何要把parentElement設為『document.querySelector('.XXXXX')』？？
    // 因為會把render spinner、render success or error message、render recipe整體變簡單
    // so if每一個小孩views都有自己的parentElement property，那麼it will be easy to do all of those tasks
	// _errorMessage 跟 _successMessage也是同理

    _parentElement = document.querySelector('.recipe');
    
    // 錯誤訊息要寫在這個檔案，因為是recipeView要呈現給用戶看
    _errorMessage = `We cannot find the recipe 💥💥💥💥no good啊～～試試別的吧`;
    _successMessage = ``;
    

    /*
    把這一整段移到爸爸身上⬇️，讓每個view都能繼承這些東西，就是說這一段都是共用並重複使用
    _data;
    render(data){
        this._data = data;
        const markUp = this._generateMarkUp(); 
        this._clear() // 把預設的文字清空
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }
    
    // 讀取轉圈圈的小動畫
    renderSpinner() {
        const markUp = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear(); // 把之前顯示的畫面清空
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }


    renderError(message = this._errorMessage) {
        const markUp = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear(); // 把之前顯示的畫面清空
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }


    renderMessage(message = this._successMessage) {
        const markUp = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear(); // 把之前顯示的畫面清空
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }
    */



    // 影片第294集說明Publisher Subscriber Pattern
    // publisher
    addHandlerRender(handler){
        ['hashchange', 'load'].forEach(loopEvent => window.addEventListener(loopEvent, handler));
    }


    addHandlerUpdateServing(handler){
        this._parentElement.addEventListener('click', function(e){
            e.preventDefault();
            // 用e.target來找爸爸的小孩，去看筆記『效率使用e.target。 Event Delegation』、『DOM Traversing 穿梭在爸爸兒子兄弟姊妹之間』
            
            const btn = e.target.closest('.btn--update-servings')
            

            if(!btn) return;

            // console.log(btn); // 檢查btn的情況



            const {updateTo} = btn.dataset;  // 解構updateTo的寫法
            // console.log(updateTo);  // 檢查updateTo的情況
            if(+updateTo > 0) handler(+updateTo);  // 解構updateTo的寫法



            // const updateTo = +btn.dataset.updateTo;  // 沒有解構updateTo的寫法
            // if(updateTo > 0) handler(updateTo);  // 解構updateTo的寫法
        })
    }


    // 負責書籤 listener
    addHandlerAddBookmark(handler){
        this._parentElement.addEventListener('click', function(e){

            const btn = e.target.closest('.btn--bookmark');
            if(!btn) return;
            handler();
        })
    }


    _generateMarkUp(){
        return `
        <figure class="recipe__fig">
            <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                </svg>
                </button>
            </div>
            </div>

            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn--bookmark">
            <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
            </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${this._data.ingredients.map(this._generateIngredient).join('')}
            </ul>
        </div>

        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
            >
            <span>Directions</span>
            <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
            </a>
        </div>
    `;
    }

    _generateIngredient(ingredient){
        return `
            <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ingredient.quantity ? ingredient.quantity : ''}</div>
            <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
            </div>
            </li>
        `}
}

export default new RecipeView(); // 以這樣的形式做輸出
// 並不是以➡️➡️ export default class RecipeView{} 的形式輸出