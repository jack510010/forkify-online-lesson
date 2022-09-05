import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';  // 引入resultsView
import paginationView from './views/paginationView.js';  // paginationView
import bookmarksView from './views/bookmarksView.js';  // 引入bookmarksView
import addRecipeView from './views/addRecipeView.js';  // 引入addRecipeView
import { MODAL_CLOSE_SEC } from './config.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime.js';


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// module.hot對JS來說是看不懂的，是parcel看得懂，影片第278集有說明，在10:30的位置開始看
// if(module.hot){
//   module.hot.accept();
// };


// 食譜主畫面
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);  // 取代res那邊的hardcode
    // console.log(id);  

    if(!id) return; // 如果沒有id就不做事，沒有這行就會報錯，spinner會永遠的轉下去
    recipeView.renderSpinner(); // 讀取轉圈圈


    // step 0: update results view to mark selected search results
    resultsView.update(model.getSearchResultPage())


    // step 1: 也一併更新書籤，書籤那邊的視覺效果會改變（會反灰，如果當前食譜已加到書籤裡的話），
    // 這裡是『更新』不是render喔
    bookmarksView.update(model.state.bookmarks);
    

    // step 2: Loading Recipe
    await model.loadRecipe(id); // ⬅️他是個async func會return promise回來所以要await他，但是他並沒有return一個value回來所以不需要設一個變數去接住他。
    
    
    // step 3: Rendering the Recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    // console.error(err);
    recipeView.renderError()
    console.error(err);
  }

};


// search 搜尋功能
const controlSearchResults = async function () {
  try{
    resultsView.renderSpinner();  // 讀取轉圈圈，轉圈圈會在最前面，才符合邏輯啊代表他在讀取啊
    // console.log(resultsView);


    // 在searchView.js的 input 抓到搜尋關鍵字
    const query = searchView.getQuery();
    if(!query) return;


    // 在model.js裡面搜尋資料
    await model.loadSearchResults(query);


    // 得到搜尋資料 console.log(model.state.search);


    // 把搜尋的資料render出來
    // resultsView.render(model.state.search.results) 這個是全部顯示出來
    resultsView.render(model.getSearchResultPage());  // 這個是部分顯示出來


    // render initial 頁數 buttons，把model.js裡面的state.search的資料帶入
    paginationView.render(model.state.search);

  }
  catch(err){
    console.error(err);
  }
};


// 頁碼button畫面控制
const controlPagination = function (gotoPage) {
  // console.log(`page controller`);  試試這個func會不會動

  // console.log(gotoPage);  檢查是否從『paginationView.addHandlerClick』拿到gotoPage


  // render 新的resultsView 還有新的paginationView
  resultsView.render(model.getSearchResultPage(gotoPage));
  paginationView.render(model.state.search);
};


// 控制餐點數量
const controlServings = function(updateTo){

  // 標題： Update the recipe servings (in state)
  // as always, we will NOT wanna manipulate data directly here in a controller,
  // instead we delegate that task to the model which is all about data.
  model.updateServings(updateTo);


  // 標題： Update the recipe view
  // recipeView.render(model.state.recipe);  我們應該是update頁面而不是render頁面，render吃的效能多
  recipeView.update(model.state.recipe);  // only update text and attributes in the DOM. 沒有重新渲染整個view。
}


// 書籤功能
const controlAddBookmark = function(){

// step 1: Add or Remove bookmark
  // 如果沒有model.state.recipe.bookmarked的話，把該食譜加入書籤並把state.recipe.bookmarked設為true
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
    // console.log(model.state.recipe);
  else
    // 反之，把該食譜從書籤中移除，並把state.recipe.bookmarked設為false
    model.deleteBookmark(model.state.recipe.id)


// step 2: Update recipe view
  // 新增書籤肯定會更新畫面啊，你才會知道該物品已加入書籤了啊
  recipeView.update(model.state.recipe);


// step 3: Render bookmarks 把書籤呈現在畫面上
  bookmarksView.render(model.state.bookmarks)
};


// 單純的直接render書籤畫面的部分，因為網頁刷新時就有從localStorage拿到之前存的state.bookmarks的資料
const controlRenderBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}


// upload the new recipe data
const controlAddRecipe = async function(newRecipeData){
  // console.log(newRecipeData); 檢查是否有拿到newRecipeData
  try{
    // 上傳（讀取）轉圈圈的小動畫
    addRecipeView.renderSpinner();


    // upload the new recipe data
    await model.uploadRecipe(newRecipeData); // 要記得『model.uploadRecipe』是個async func 所以他要await，然後controlAddRecipe要加上async

    console.log(model.state.recipe); // 檢查資料是否有帶到model.state.recipe裡面


    // render recipe，把剛剛上傳的食譜呈現出來
    recipeView.render(model.state.recipe)


    // render success message，顯示成功上傳
    addRecipeView.renderMessage();


    // render bookmark view 把剛剛上傳的食譜在書籤那邊render出來
    bookmarksView.render(model.state.bookmarks);


    // 改變網址列最後面的id改成剛剛上傳的食譜id， change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    

    // 2.5秒後把modal關掉，close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)

  } catch(err){

    console.error('💥', err);

    addRecipeView.renderError(err.message)
  }
}


const newFeature = function(){
  console.log('Welcome to the application!!!');
};

// 影片第294集說明Publisher Subscriber Pattern
// subscriber
const init = function() {
  // 一開始就從localStorage 把拿到的bookmarks資料 用bookmarksView去把它render出來
  bookmarksView.addHandlerRender(controlRenderBookmarks);


  // 呼叫recipeView的呈現畫面功能
  recipeView.addHandlerRender(controlRecipes);


  // 呼叫recipeView的更新餐點數量功能
  recipeView.addHandlerUpdateServing(controlServings);


  // 呼叫recipeView的書籤功能
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);


  addRecipeView.addHandlerUpload(controlAddRecipe)

  newFeature();
  /*  
  no recipe has yet arrived from the API,
  and so therefore state.recipe is not yet defined.
  !  不能在這裡測試 『 controlServings() 』，因為上面的程式碼還在async/await抓資料，所以這個時候model.state還沒成型
  !  只會抓到undefined而已
  */
};
init();


