import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';  // 但是因為是用parcel啟動的，路徑要加上url

class ResultsView extends View {
    // 這裡注意命名要一樣不能取名_parentEl，因為他在爸爸那邊找不到_parentEl，爸爸那邊只有_parentElement
    _parentElement = document.querySelector('.results');


    // 錯誤訊息可以直接在爸爸那邊（View.js）就完成
    _errorMessage = 'No recipe found for your query🥺 Please try again.';
    _successMessage = '';
    
    _generateMarkUp(){
        // console.log(this._data); // 看看有沒有拿到資料

        return this._data
            .map(result => previewView.render(result, false))
            .join('');
        
    }


}

export default new ResultsView();