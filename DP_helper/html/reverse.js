
//逆向代码


// (function () {
//     let consoleCache = console.log;
//     console.log = function (msg) {
//         consoleCache("逆向助手-Hook console.log =>", msg);

//         consoleCache(msg);
//     };
// })();


var reverse_debugger_code = '(function () {\
    let constructorCache = Function.prototype.constructor;\
    Function.prototype.constructor = function (string) {\
        if (string === "debugger") {\
            console.log("Hook constructor debugger!");\
            return function () {};\
        }\
        return constructorCache(string);\
    };\
})();\
';

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

var json_data =
{
    "console.log": "console.log",
    "fetch": "fetch",
    "cookie": "cookie",
    "debugger": "debugger",
    "Function": "Function",
    "JSON.stringify": "JSON.stringify",
    "JSON.parse": "JSON.parse"
}

function start_hook(code){
    chrome.devtools.inspectedWindow.eval(
        code, 
        (result, isException) => {
                       
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('逆向成功，结果:', result);
                window.info_father = result;
                // window.info_father_json = JSON.parse(result);
               
            }
        }
    );
}



// start_hook(reverse_fetch_code);

function createRadioButtons(jsonData) {
    // 获取容器元素
    const container = document.getElementById('option');
    
    // 清空容器内容
    container.innerHTML = '';
    
    // 遍历 JSON 数据
    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            // 创建 label 元素
            const label = document.createElement('label');
            label.textContent = key;
            
            // 创建 radio input 元素
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'options'; // 确保所有单选框有相同的 name
            radio.value = jsonData[key];
            
            // 设置默认选中的单选框（可根据需求进行调整）
            if (key === 'tagname') {
                radio.checked = true;
            }
            
            // 将 radio 添加到 label 中
            label.appendChild(radio);
            
            // 将 label 添加到容器中
            container.appendChild(label);
        }
    }
}

  
// createCheckboxes(json_data);
createRadioButtons(json_data);

// 监听点击事件

document.getElementById('option').addEventListener('click', (event) => {
    let selectedRadio = document.querySelector('input[name="options"]:checked');
    console.log("被选中的-",selectedRadio);
    let rizhi=document.getElementById('rizhi');
    switch (selectedRadio.value) {
        case 'console.log':
            // alert('Selected console.log');
            if(rizhi.innerHTML.includes('console.log')){
                appendToDiv(' console.log 成功hook');
            }else{
                appendToDiv(' console.log 早已经成功hook');
                start_hook(reverse_console_code);
            }


            break;
        case 'fetch':
            // alert('Selected fetch');
            appendToDiv(' fetch 已经成功hook');
            start_hook(reverse_fetch_code);
            break;
        case 'debugger':
            
            appendToDiv(' debugger 已经成功hook');
            start_hook(reverse_debugger_code);
            break;
        default:
            console.log('No option selected');
    }
});


//追加字符串
function appendToDiv(newText) {
    // 获取 <div> 元素
    const div = document.getElementById('rizhi');
    
    // 获取当前的文本内容
    let currentHtml = div.innerHTML ;

    // 追加新的文本
    div.innerHTML = currentHtml +'<br>'+ newText;
}

// 使用示例
// appendToDiv('这是要追加的文本。');
