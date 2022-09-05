import {API_URL, RES_PER_PAGE, KEY} from './config.js'
// import { getJSON, sendJSON } from './helper.js'
import { AJAX } from './helper.js'; // AJAX 取代上面的 getJSON, sendJSON

export const state = {
    recipe: {},
    search: {
        query: ``,
        results: [],
        page: 1,
        resultPerPage: RES_PER_PAGE,
    },
    
    // 紀錄書籤bookmark
    bookmarks: [],
};

const createRecipeObject = function(data){
    const { recipe } = data.data;
    // state.recipe =  下面這一串⬇️
    return {
        cookingTime: recipe.cooking_time,
        id: recipe.id,
        image: recipe.image_url,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        title: recipe.title,

        // 如果recipe.key不存在，那麼啥事都沒有; 那如果recipe.key存在，then the second part of the operator is executed and returned。
        ...(recipe.key && {key: recipe.key}),
        // key: recipe.key 這裡⬅️就會多一行這個
    };
};

export const loadRecipe = async function(id){
    try{
        // const res = await fetch(
            //     `${API_URL}/${id}`  // 網址從config.js輸入，因為希望他保持constants的特性
            //     // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
            //     );
            
            // const data = await res.json();
            
            // if (!res.ok) throw new Error(`${data.message} (💥😱${res.status})`);
            
        // 這行⬇️從helper.js來的，取代了原本上面的程式碼
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
            
        state.recipe = createRecipeObject(data);


        // 如果state.bookmarks裡面的任何一個id，等於我們async進來的id的話，就把當前的食譜state.recipe.bookmarked設為true。
        if(state.bookmarks.some(bookmark => bookmark.id === id)) // 最後面的那個『id』是從這裡來的『loadRecipe = async function(id)』
            state.recipe.bookmarked = true;

        else // 反之，設為false
            state.recipe.bookmarked = false;

        console.log(state.recipe);
    }
    catch(err){
        // console.error(`${err} 💥💥💥💥no good啊～～`);
        throw err;
    }
};


// 輸出一個搜尋功能給controller去使用
export const loadSearchResults = async function(query){
    try{
        state.search.query = query; // 把搜尋字存進state.search裡面

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data); // 看看拿到的data長什麼樣子
        

        // 把拿到的data用map創一個新的然後重新命名，然後儲存在state.search.results裡面
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                image: recipe.image_url,
                publisher: recipe.publisher,
                title: recipe.title,
                ...(recipe.key && {key: recipe.key}),
            }
        });

        // 當使用者搜尋別的食譜時，把頁碼reset回1，你每搜尋一個新的食譜一定是從第一頁開始
        state.search.page = 1;
        
    }
    catch(err){
        console.error(`${err} 💥💥💥💥no good啊～～`);
        throw err;
    }
};


// 把搜尋結果放入頁面，他不是async/await，在這個時間點我們的資料早就已經fetch好了
export const getSearchResultPage = function(page = state.search.page){
    // 這裡面要return的是『部分的搜尋結果』
    
    state.search.page = page;  // ⬅️用意是記住目前所在頁面
    
    const start = (page - 1) * state.search.resultPerPage; // 包含起點
    const end = page * state.search.resultPerPage;  // 不包含終點


    // 不要在slice裡面hardcode，所以我們來創造變數
    return state.search.results.slice(start, end);
};


export const updateServings = function(newServings){
    // 這個func他要做的事就是reach into the state.recipe.ingredients，
    // and then change the quantity in each ingredient.

    state.recipe.ingredients.forEach(ingredient => {
        
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
        // newQt = oldQt * (newServings / oldServings)，比如說 新的8份套餐 = 舊的4份套餐 * 新人數8人 / 舊人數4人

    })

    state.recipe.servings = newServings; // 最後要把上餐數量更新
};


// 把書籤儲存在localStorage
// whenever we add a bookmark or delete a bookmark, we need to 留意、注意 that data
const persistBookmarks = function(){

    // 忘記localStorage、JSON.stringify 去看筆記『 標題 Working with localStorage 』
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
};


// 增加書籤功能在這裡～～
// 我們需要整個recipe的資料
export const addBookmark = function(recipe){

    // 加入書籤
    state.bookmarks.push(recipe);

    
    // 顯示當前食譜已加入書籤
    // 如果傳進來的recipe.id 跟當前食譜的id一樣的話，把新變數state.recipe.bookmarked 設為true
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;


    // 把資料存到localStorage
    persistBookmarks();
};


// 移除書籤功能在這裡～～
// 我們只需要id就好，不需要整個recipe的資料
export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el => el.id === id);

    // 筆記裡面有splice的用法
    // here we need the index where the element is actually located
    state.bookmarks.splice(index, 1);

    // 把要刪除書籤的食譜設為false
    if(id === state.recipe.id) state.recipe.bookmarked = false;


    // 把刪除後的資料存到localStorage，可以把空的資料存進去，意思就相當於覆蓋掉了
    persistBookmarks();
};


// 從提取localStorage資料
const init = function(){
    const storage = localStorage.getItem('bookmarks');

    // 如果有storage，就把state.bookmarks變成JSON轉化好的資料
    if(storage) state.bookmarks = JSON.parse(storage);
};
init(); // 立即、馬上執行取得localStorage資料
console.log(state.bookmarks); // 檢查是否拿到JSON轉化好的資料



// this one will eventually make a request to the API and so therefore it's gonna be a async func
export const uploadRecipe = async function(newRecipeData){

    /* 
    the FIRST task of this func here will be to take the raw input data 
    and transform it into the same format as the data that we also get out of the API.
    */

    // console.log(Object.entries(newRecipeData));  // 檢查長什麼樣子


    // we wanna create an array of ingredients，只要ingredients其他不要 and then the second part should't be empty
    try{

        const ingredients = Object.entries(newRecipeData)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
    
                // const ingArr = ing[1].replaceAll(' ', '').split(',')
                const ingArr = ing[1].split(',').map(el => el.trim());
    
                if(ingArr.length !== 3) throw new Error('Wrong ingredient format! 請用正確的格式～')
    
                const [quantity, unit, description] = ingArr
    
                return {
                    quantity: quantity ? +quantity : null,
                    unit, 
                    description
                };
            })
    
        // console.log(ingredients); 檢查ingredients


        // now it's time to actually create the object that is ready to be uploaded.⬇️
        const recipe = {
            cooking_time: +newRecipeData.cookingTime,
            image_url: newRecipeData.image,
            publisher: newRecipeData.publisher,
            servings: +newRecipeData.servings,
            source_url: newRecipeData.sourceUrl,
            title: newRecipeData.title,
            ingredients
        }

        // console.log(recipe); 檢查recipe


        // and so now, let's use our sendJSON func from 『helper.js』 to create the AJAX request
        // 記得！this⬇️ will send the recipe back to us, so store it as data and also await it.
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
        
        console.log(data); // 檢查data

        state.recipe = createRecipeObject(data);


        // 加入到書籤裡面
        addBookmark(state.recipe);

    } catch(err){
        throw err;
    }
};