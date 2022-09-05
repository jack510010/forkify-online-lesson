/*
目的：
contain a couple of funcs that we reuse over and over in our project.
*/
import {TIMEOUT_SEC} from './config.js'

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


// 從API抓資料
export const getJSON = async function(url){
    try{
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message} (🥺😱${res.status})`);

        return data;
    }
    catch(err){
        // console.error(err);

        throw err;
    }
}


// 上傳資料到API
export const sendJSON = async function(url, uploadData){
    try{

        // 『 to send data 』needs to be a post request
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(uploadData)
        });
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message} (🥺😱${res.status})`);

        return data;
    }
    catch(err){
        // console.error(err);

        throw err;
    }
}

/*
『 to send data 』needs to be a post request
fetch(url, {
    method: 'POST',                          FIRST Option is method


    headers: {                               SECOND is headers, headers are basically some snippets of text, which are like information about the request itself
        'Content-Type': 'application/json'   意思是說 we tell the API, we specify in the request that the data which we're gonna send is gonna be in the JSON format。
    },


    body: JSON.stringify()                   finally, the payload of the request, so basically the data that we wanna send, which is called the body.

})


f27db5be-76fa-42ab-a348-56634aae5888

*/


// 因為getJSON、sendJSON這兩個太像了，所以把他們refactor，統稱叫AJAX
export const AJAX = async function(url, uploadData = undefined){
    try{

        // 『 to send data 』needs to be a post request
        const fetchPro = uploadData 
            ? fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(uploadData)
            })
            : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(`${data.message} (🥺😱${res.status})`);

        return data;
    }
    catch(err){
        // console.error(err);

        throw err;
    }
};