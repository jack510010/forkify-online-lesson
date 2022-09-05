// this class⬇️ is not gonna render anything.
// All we want is to get the query and eventually to also listen for the click event on the button
class SearchView {
    _parentEl = document.querySelector('.search')

    getQuery(){
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput(){
        this._parentEl.querySelector('.search__field').value = '';
    }


    // 採用影片第294集說明Publisher Subscriber Pattern，一樣的概念
    // publisher
    addHandlerSearch(handler){
        this._parentEl.addEventListener('submit', function(e){
            e.preventDefault();
            handler();

        })
    }
}

export default new SearchView();