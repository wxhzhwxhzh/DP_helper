

const types = {};

chrome.devtools.inspectedWindow.getResources((resources) => {
  resources.forEach((resource) => {
    // 检查资源类型是否已经存在于 types 对象中，如果不存在则初始化为 0
    if (!(resource.type in types)) {
      types[resource.type] = 0;
    }
    types[resource.type] += 1;
  });

  // 序列化 resources 数组中的特定属性，而不是整个对象
  let serializedResources = resources.map((resource) => ({
    url: resource.url,
    type: resource.type
  }));

  // 构建显示在文本域中的结果字符串
  let result = `此页面的资源统计：\n\n`;
  result += Object.entries(types)
    .map((entry) => {
      const [type, count] = entry;
      return `${type}: ${count}`;
    })
    .join('\n');
  result += '\n\n资源详细信息：\n';
  result += JSON.stringify(serializedResources, null, 2);

  // 创建一个文本域元素
  let ele = document.createElement('textarea');
  ele.style.width = '95%';
  ele.style.height = '400px'; // 设置文本域的高度
  ele.style.fontFamily = 'consolas'; // 使用等宽字体以保持格式化的内容
  ele.style.margin = '5px';
  
  ele.textContent = result;

  // 将文本域添加到页面的body中
  document.body.appendChild(ele);
});

chrome.devtools.inspectedWindow.getResources(function(resources) {
  // 遍历所有资源，查找名称为 'stGetFreeBacklinksList' 的资源
  resources.forEach(function(resource) {
      if (resource.url.includes('GetFreeBacklinksList')) {
          // 找到了名为 'stGetFreeBacklinksList' 的资源
          resource.getContent(function(content, encoding) {
              if (encoding === 'base64') {
                  // 如果内容是 base64 编码的，需要解码
                  content = atob(content);
              }
              try {
                  const jsonData = JSON.parse(content);
                  console.log('JSON data for stGetFreeBacklinksList:', jsonData);
                  // data_to_window(content);
                  // 在这里处理获取到的 JSON 数据
                  
              } catch (error) {
                  console.error('Error parsing JSON:', error);
              }
          });
      }
  });
});


data_to_window('你想认识7');

function data_to_window(data){
  jscode='window.info1="ppp"'.replace('ppp',data)
  
  chrome.devtools.inspectedWindow.eval(
    jscode, // $0 refers to the currently selected element in the Elements panel
    (result, isException) => {})
}


// 从 content script 发送消息到 background script
async function send_action(msg,shuju){

  let response = await  chrome.runtime.sendMessage({ action: msg, data: shuju });
  console.log("接受信息- response from background script:", response);
}



console.log(1231213);