
var sao_2=document.getElementById('sao2');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // 接受content.js发送的消息，


    //接受content.js发送的消息
    if (message.cebianlan) {        
        sao_2.innerHTML=message.cebianlan;
    }
    
});




document.getElementById('anniu1').addEventListener('click',(e)=>{
    ask_for_hover_ele();
})

// 侧边栏页面脚本


function ask_for_hover_ele(){

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // tabs 是一个数组，包含当前窗口中所有激活的标签页
        let activeTab = tabs[0]; // 获取第一个激活的标签页（通常是当前标签页）
      
        // 通过标签页的 id 发送消息
        chrome.tabs.sendMessage(activeTab.id, { need: "window" }, function(response) {
          console.log("Received response from active tab:", response);
        //   window.location.href
          document.getElementById('sao3').innerText=JSON.stringify(response.data.href);
          // 在这里处理收到的响应
        });
      });
}