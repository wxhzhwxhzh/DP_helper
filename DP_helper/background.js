// 永久储存对象



chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install' || details.reason === 'update' ) {
        console.log('首次安装');
        
        chrome.storage.local.set({ 'yuananniu_show': true }, function () {
            console.log('永久存储对象 yuananiu_show 已经初始化');            
        });

    } else {
        console.log('早已安装');
    }
});

// 在 background.js 中接收来自 popup 页面的消息
// 在 background.js 中接收来自 popup 页面的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.from === "popup_page") {
        (async () => {
            let aa = await chrome.storage.local.get('yuananniu_show');
            sendResponse({ yuananniu_show: aa });
        })();
        // 返回 true 表示异步操作，sendResponse 将在异步操作完成后调用
        return true;
    }
});


// 在 background 页面接收来自 DevTools 的消息
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "devtools-page") {
        // Event listener for messages from the devtools page
        port.onMessage.addListener(function(message) {
            console.log("Message from 抓包助手:", message);
            send_action_to_currentWindow(message);
        });
    }
});


 // 从 background.js 向 content.js 发送消息
function send_action_to_currentWindow(data){   
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // tabs 是一个数组，包含当前窗口中的所有标签页对象
        chrome.tabs.sendMessage(tabs[0].id, { action: "抓包助手",json:data });
    });
}


// 检查是否已存在具有相同 ID 的菜单项,如果有就清空
chrome.contextMenus.removeAll(
);

// 创建新的右键菜单
create_right_menu();

function create_right_menu() {

    chrome.contextMenus.create({
        id: "youdao",
        title: "有道翻译",
        contexts: ["selection"],
       
    });

    chrome.contextMenus.create({
        id: "copyDP_simple",
        title: "复制 Drissionpage精简语法",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "copyDP",
        title: "复制 Drissionpage完整语法",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "copyXpath",
        title: "复制 Xpath语法",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "fingerPrint",
        title: "指纹检测",
        contexts: ["all"],

    });

    // 创建第二级子菜单项1
    chrome.contextMenus.create({
        id: "sub_setup",
        title: "录制当前元素的",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "luzhi_click",
        title: "🔵click语法",
        contexts: ["all"],
        parentId: "sub_setup"

    });
    chrome.contextMenus.create({
        id: "luzhi_input",
        title: "🔵input语法",
        contexts: ["all"],
        parentId: "sub_setup"

    });
    chrome.contextMenus.create({
        id: "luzhi_text",
        title: "🔵text值",
        contexts: ["all"],
        parentId: "sub_setup"

    });
    chrome.contextMenus.create({
        id: "luzhi_href",
        title: "🔵超链接",
        contexts: ["all"],
        parentId: "sub_setup"

    });
    chrome.contextMenus.create({
        id: "luzhi_shot",
        title: "🔵截图",
        contexts: ["all"],
        parentId: "sub_setup"

    });
    // 创建第二级子菜单项1
    chrome.contextMenus.create({
        id: "sub_page",
        title: "录制当前页面",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "luzhi_title",
        title: "🔵标题",
        contexts: ["all"],
        parentId: "sub_page"

    });
    chrome.contextMenus.create({
        id: "luzhi_UA",
        title: "🔵UA",
        contexts: ["all"],
        parentId: "sub_page"

    });
    chrome.contextMenus.create({
        id: "luzhi_cookie",
        title: "🔵cookie",
        contexts: ["all"],
        parentId: "sub_page"

    });
  

   

    // 创建第二级子菜单项2
    chrome.contextMenus.create({
        id: "more",
        title: "更多",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "vip",
        title: "解析当前网页视频",
        contexts: ["all"],
        parentId: "more"
    });
    chrome.contextMenus.create({
        id: "exe_js",
        title: "js代码调试",
        contexts: ["all"],
        parentId: "more"
    });

    chrome.contextMenus.create({
        id: "download_video",
        title: "视频解析下载",
        contexts: ["all"],
        parentId: "more"
    });

}

// chrome.scripting.executeScript({
//     target:tab.id,
//     function:update_contextMenus,
// });


// 根据菜单项ID调用不同的函数// 根据菜单项ID调用不同的函数
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    const functions = {
        "copyDP_simple": showElementDP_simple,
        "copyDP": showElementDP,
        "copyXpath": showElementXpath,        
        "vip": parserVideo,
        "copy_input": copy_ele_and_input,
        "copy_click": copy_ele_and_click,
        "cookie": getCookie,
        "fingerPrint": scan_finger_print_,
        "luzhi_click": info_show_switch_,
        "luzhi_input": set_ele_loc,
        "copy_code": copy_init_code,
        "copy_ua": getUA,
        "exe_js": exe_js,
        
        "youdao": youdao,
        "download_video": download_video
    };

    const func = functions[info.menuItemId];
    
    if (func) {
        let executeScriptParams = {
            target: { tabId: tab.id },
            function: func
        };

        // 如果是特定的菜单项，传入额外的参数
        if (info.menuItemId === 'youdao') {
            executeScriptParams.args = [info.selectionText];
            // chrome.contextMenus.update("youdao",{title:`有道翻译 ${info.selectionText} `});
            console.log(info);
        }

        chrome.scripting.executeScript(executeScriptParams);
    } else {
        console.log("Unsupported menu item ID:", info.menuItemId);
    }
});


// 监听函数

// 监听来自 content.js Script 的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // 如果消息包含标题信息
    if (message.youdao_text) {
         // 更新右键菜单的二级菜单名
         chrome.contextMenus.update("youdao", { title: `用有道翻译  "${message.youdao_text}" ` });
      
    }
});

// 工具库 函数

function getCookie() {
    main_app.copyToClipboard(document.cookie);
    alert('网页的cookie已经复制到剪贴板 \n' + document.cookie);

}
function scan_finger_print_() {
    window.open("https://ip77.net/", "_blank");

}

function getUA() {
    main_app.copyToClipboard(navigator.userAgent);

    alert('网页的UA已经复制到剪贴板 \n' + navigator.userAgent);
}

function exe_js() {
    main_app.execute_js();

}
function showElementDP_simple() {
    main_app.extractInfoAndAlert_simple();

}

function showElementDP() {
    main_app.extractInfoAndAlert();
}

function showElementXpath() {
    main_app.copyElementXPath();
}
function copy_ele_and_input() {
    main_app.extractInfoAndAlert_simple_input();
}

function copy_ele_and_click() {
    main_app.extractInfoAndAlert_simple_click();
}


function youdao(word) {
    // main_app.addClickEventToInputs();
    // alert('-✔️骚神库元素定位插件- \n  插件已经深度解析，并重新定位动态元素!!');
    window.open(`https://dict.youdao.com/result?word=${word}&lang=en`);


}

function refresh_init() {
    main_app.addClickEventToInputs();
    main_app.listen_for_mousemove();

}

//------------
function parserVideo() {
    // 获取当前网页的网址
    var currentURL = window.location.href;
    // 拼接新的网址
    var newURL = "https://jx.jsonplayer.com/player/?url=" + window.location.href;

    // 在新标签页中打开新网址
    window.open(newURL, "_blank");
}

function info_show_switch_() {
    info_show_switch();
}
function set_ele_loc() {
    selectAlert.show();
}

function download_video() {
    main_app.download_video();

}

function copy_init_code() {
    // copyToClipboard(init_code);  
    navigator.clipboard.writeText(init_code);
    // AutoDismissAlert('已经复制 \n'+init_code,2000);
    alert('当前网页启动代码已经复制 \n' + init_code);
}





