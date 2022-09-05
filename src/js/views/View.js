import icons from 'url:../../img/icons.svg';  // 但是因為是用parcel啟動的，路徑要加上url

export default class View {
    _data;
    
    /**
     * render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (ex: recipe)
     * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
     */
    render(data, render = true) {
        /*
        我們可以在render這裡一開始就檢查是否有data進來，不管這個data是object or array，
		所以在這裡我們加上防呆機制
		沒有data 或者 這個array data的長度為0（就是empty array）
		『!data』只對undefined還有null有效
        */
        if(!data || (Array.isArray(data) && data.length === 0)) 
            return this.renderError();


        this._data = data;
        const markUp = this._generateMarkUp(); 

        if(!render) return markUp;

        this._clear() // 把預設的文字清空
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }


    // 跟render不一樣，只有更新text and attribute
    update(data){
        // if(!data || (Array.isArray(data) && data.length === 0)) 
        //     return this.renderError();


        this._data = data;


        // create new markUp but not render it
        const newMarkUp = this._generateMarkUp();

        /*
        and then compare the new HTML to the current HTML
        and then only change text and attributes that actually have changed,
        from the old version to the new version.

        now we have the 『newMarkUp』，but that is just a string
        so we need to convert this markUp string to a DOM object
        then we can use it to compare with the actual DOM that's on the page.
        */
        // this『document.createRange()』will create something called a range
        // this 『createContextualFragment()』is where we then pass in the string，it will then convert that string into real DOM Node objects.
        const newDOM = document.createRange().createContextualFragment(newMarkUp);
        /*
        so the『newDOM』will become like a big object which is like a virtual DOM.
        So a DOM that is NOT really living on the page but which lives in oir memory.
        And so we can now use that DOM as if it was the real DOM on our page.
        */
        
        // const newElement = newDOM.querySelectorAll('*');
        // console.log(newElement); // 抓到 the entire list of all the elements in the new DOM.
        const newElements = Array.from(newDOM.querySelectorAll('*'));


        // 接著要讓新的取代舊的，所以也要把舊的全部找出來，再來因為他們是NodeList所以我們可以用Array.from，把他們變成array
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(curElements, newElements);  // 檢查是否舊的新的都抓到


        // gonna loop over the newElements array and curElements array
        newElements.forEach((newEl, index) => {
            const curEl = curElements[index];
            // ----------------------------這裡開始有超級大問題！！！！！！------------------------------------

            /*
            a very handy method that is available on all Nodes, which is 『 isEqualNode() 』
            『 isEqualNode() 』 it will compare the content of newEl and curEl
            */
            // console.log(curEl, newEl.isEqualNode(curEl));

            
            // 如果不一樣的話，要把舊內容換成新內容
            // Updates changed TEXT
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
                // console.log('💥💥', newEl.firstChild.nodeValue.trim());
            }

            // 如果不一樣的話，要把attributes舊換成attributes
            // Updates changed ATTRIBUTES
            if(!newEl.isEqualNode(curEl))
                // console.log(Array.from(newEl.attributes));
                Array
                    .from(newEl.attributes)
                    .forEach(attr => 
                        curEl.setAttribute(attr.name, attr.value));


            /*
            為何不直接這樣寫就好？？？？？
            if(!newEl.isEqualNode(curEl)){
                curEl.innerHTML = newEl.innerHTML;
            }
            */
        });
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
}