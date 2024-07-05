

// iframe页面接受不同域的信息
window.addEventListener('message', function(event) {
    // 检查源是否可信
    if (event.origin !== 'https://parent-page-domain.com') {
      console.log(event); // 来源不匹配，不处理消息
    }
  
    console.log('Received message from parent:', event.data);
    content_data=event.data;
    insertTextIntoTextarea(content_data);
    // 可以在这里根据接收到的数据执行相应的操作

  }, false);


  function insertTextIntoTextarea(text) {
    // 获取 textarea 元素
    var textarea = document.getElementById('json-input');

    // 将信息插入到 textarea 中
    textarea.value += text;
}


