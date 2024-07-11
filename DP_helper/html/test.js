
const types = {};

chrome.devtools.inspectedWindow.getResources((resources) => {

  resources.forEach((resource) => {
    // 检查资源类型是否已经存在于 types 对象中，如果不存在则初始化为 0
    if (!(resource.type in types)) {
      types[resource.type] = 0;
    }
    types[resource.type] += 1;
  }
  );

  // 序列化 resources 数组中的特定属性，而不是整个对象
  let serializedResources = resources.map((resource) => ({
    url: resource.url,
    type: resource.type
  }));

  // 构建显示在文本域中的结果字符串
  let result = `此页面的资源统计：\n\n`;
  result += Object.entries(types).map((entry) => {
    const [type, count] = entry;
    return `${type}: ${count}`;
  }
  ).join('\n');
  result += '\n\n资源详细信息：\n';
  result += JSON.stringify(serializedResources, null, 2);

  // 创建一个文本域元素
  let ele = document.createElement('textarea');
  ele.style.width = '95%';
  ele.style.height = '400px';
  // 设置文本域的高度
  ele.style.fontFamily = 'consolas';
  // 使用等宽字体以保持格式化的内容
  ele.style.margin = '5px';

  ele.textContent = result;

  // 将文本域添加到页面的body中
  document.body.appendChild(ele);
}
);

 
// 在 DevTools 中建立到 background 的长期连接
const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

// 发送消息到 background 
function send_msg(msg) {
  backgroundPageConnection.postMessage({ type: "message-from-devtools", from: '抓包助手', json: msg });
}
//工具函数
function to_json_or_not(str) {
  try {
      return JSON.parse(str);
  } catch (e) {
      // 如果解析失败，则返回原始的字符串
      return str;
  }
}

function extract_fetch_data() {
  chrome.devtools.inspectedWindow.getResources((resources) => {

    resources.forEach((resource) => {
      if (resource.type == 'fetch' || resource.type == 'xhr' ) {
        console.log('本页面中的fetch资源-', resource);
        resource.getContent(function (content, encoding) {

          fetch_data = {
            type: resource.type,
            url: resource.url,
            encoding: encoding,
            content: to_json_or_not(content)
          }
          // console.log('fetch资源',fetch_data);
          
          send_msg(fetch_data);

        });
      }
    }
    );
  })
}

extract_fetch_data();




