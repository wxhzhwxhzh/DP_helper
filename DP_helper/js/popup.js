function set_on() {
    chrome.storage.local.set({ show_div: '显示' }, function () {
        console.log('Data saved.');
    });

    // 读取数据
    chrome.storage.local.get('show_div', function (result) {
        
        document.getElementById('ceshi').innerHTML = '->' + result.show_div;
        document.getElementById('on1').innerHTML = '关闭信息展示栏';
        document.getElementById('on1').style.backgroundColor = 'red'
        // console.log(result.show_div);

    });

}
function set_off() {
    chrome.storage.local.set({ show_div: '隐藏' }, function () {
        console.log('Data saved.');
    });

    // 读取数据
    chrome.storage.local.get('show_div', function (result) {
        
        document.getElementById('ceshi').innerHTML = '->' + result.show_div;
        document.getElementById('on1').innerHTML = '开启信息展示栏';
        document.getElementById('on1').style.backgroundColor = 'green'
        // console.log(result.show_div);

    });

}


function toggleSwitch_button() {
        // 切换开关状态

    if (document.getElementById('ceshi').innerHTML.includes('显示')) {

        set_off();
        
    } else {
        set_on();
        
    }
}
function scan_finger_print(){
    window.open("https://ip77.net/", "_blank");
}
function open_video_website(){
    window.open("https://space.bilibili.com/308704191/channel/collectiondetail?sid=1947582", "_blank");
}
function open_chaxun_website(){
    let info=document.getElementById('search_input').value;
    window.open("https://drissionpage.cn/search?q="+info, "_blank");
}

// 获取 on1 按钮元素并添加点击事件监听器




document.getElementById('on1').addEventListener('click', scan_finger_print);
document.getElementById('jiaocheng').addEventListener('click', open_video_website);
document.getElementById('search').addEventListener('click', open_chaxun_website);






// 获取到 checkbox 元素
const checkbox = document.getElementById('kaiguan2');


// 添加监听事件
checkbox.addEventListener('change', function() {
    // 查询当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // tabs 是一个数组，可能有多个标签页，我们通常只取第一个（当前活动标签页）
        const activeTab = tabs[0];        
        
        if (checkbox.checked) {
            chrome.storage.local.set({ 'yuananniu_show': true }, function () {});
            chrome.tabs.sendMessage(activeTab.id, { action: "on" });
            console.log('打开超级按钮');
        } else {
            chrome.storage.local.set({ 'yuananniu_show': false }, function () {});
            chrome.tabs.sendMessage(activeTab.id, { action: "off" });
            console.log('关闭超级按钮');
        }
    });
   
});



// 在 popup 页面中向 background.js 发送消息
chrome.runtime.sendMessage({ from: "popup_page" }, function(response) {
    console.log("Received response from background:", response.yuananniu_show.yuananniu_show);
    checkbox.checked=response.yuananniu_show.yuananniu_show;
});

