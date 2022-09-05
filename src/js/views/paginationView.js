import View from './View.js'
import icons from 'url:../../img/icons.svg';  // 但是因為是用parcel啟動的，路徑要加上url



class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');


    // 影片第294集說明Publisher Subscriber Pattern
    // publisher
    // 有用到event delegation，確保我們一定點擊到button而不是span或者svg
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            
            // 防呆機制
            if(!btn) return;


            // console.log(btn);  檢查是否抓到btn
            

            // 筆記title：Styles, Attributes and Classes
            const gotoPage = +btn.dataset.goto;  // 把他從字串變成number
            

            handler(gotoPage);
            
        })
    }


    _generateMarkUp(){
        console.log(this._data); // 檢查是否拿到資料

        const curPage = this._data.page;

        const numPages = Math.ceil(this._data.results.length / this._data.resultPerPage)
        console.log(numPages); //看看總頁數是多少

        // page 1, and there are other pages.
        if(curPage === 1 && numPages > 1){
            // return `page 1 and others`;
            /*
            return `
                <button class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
            */
            
            return this._generateMarkUpButtonNext(curPage)
        }
        
        
        // last page
        if(curPage === numPages && numPages > 1){
            return this._generateMarkUpButtonPre(curPage);
        }
        
        
        // other pages
        if(curPage < numPages){
            // return `other pages`;
            /*
            return `
                <button class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
            */

            return this._generateMarkUpButtonPre(curPage) + this._generateMarkUpButtonNext(curPage);
            
        }



        // page 1, and there is no other page.
        if(curPage === 1 && numPages === 1){
            // return `only 1 page`;
            return '';
        }
    }


    _generateMarkUpButtonNext(curPage){
        return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }


    _generateMarkUpButtonPre(curPage){
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
        `;
    }

}

export default new PaginationView();