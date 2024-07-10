

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

  



console.log(1231213);