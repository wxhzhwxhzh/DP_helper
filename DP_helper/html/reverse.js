
//逆向代码


// (function () {
//     let consoleCache = console.log;
//     console.log = function (msg) {
//         consoleCache("逆向助手-Hook console.log =>", msg);

//         consoleCache(msg);
//     };
// })();


var reverse_console_code = '(function () {\
    let consoleCache = console.log;\
    console.log = function (msg) {\
        consoleCache("逆向助手-Hook console.log =>", msg);\
        consoleCache(msg);\
    };\
})();';

var reverse_fetch_code= '(function () {\
    let fetchCache = Object.getOwnPropertyDescriptor(window, "fetch");\
    Object.defineProperty(window, "fetch", {\
        value: function (url) {\
            console.log("逆向助手Hook fetch url => ", url);\
            return fetchCache.value.apply(this, arguments);\
        }\
    });\
})();'




function start_hook(code){
    chrome.devtools.inspectedWindow.eval(
        code, 
        (result, isException) => {
                       
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('逆向成功，结果:', result);
                window.info_father = result;
                window.info_father_json = JSON.parse(result);
               
            }
        }
    );
}


start_hook(reverse_console_code);
start_hook(reverse_fetch_code);

