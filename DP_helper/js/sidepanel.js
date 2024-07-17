// document.getElementById('sao1').innerText=document.URL;

var sao_2=document.getElementById('sao2');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // 接受content.js发送的消息，


    //接受content.js发送的消息
    if (message.cebianlan) {        
        sao_2.innerHTML=message.cebianlan;
    }
    
});