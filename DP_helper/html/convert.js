


var extract_code = '(function() { \
var elem = $0; \
if (elem) { \
    var attributes = {"tagname":elem.tagName.toLowerCase()}; \
    var attributeNames = elem.getAttributeNames(); \
    attributeNames.forEach(function(attr) { \
        attributes[attr] = elem.getAttribute(attr); \
    }); \
    var innerText = elem.innerText; \
    if (innerText !== ""  && innerText.length <20) { \
        attributes["innerText"] = innerText;  \
    } \
    return JSON.stringify(attributes, null, 2); \
} else { \
    return "No element selected"; \
} \
})()';
// 第一次加载的时候执行一次
main_job();

// 在插件的 devtools 页面中监听元素选择事件
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    main_job();    
  });


//   主函数
function main_job() {
    // 获取当前选中的元素
    chrome.devtools.inspectedWindow.eval(
        extract_code, // $0 refers to the currently selected element in the Elements panel
        (result, isException) => {
            if (result == "No element selected") return;
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('返回结果:', result);
                window.info = result;
                document.getElementById('content').innerText = result;
                //  把json版转换成 完整版
                convertInnerText();
                //创建自定义选择复选框                
                createCheckboxes(JSON.parse(result));
                updateSelectedCheckboxes();
            }
        }
    );
}


  
  
//  把json版转换成 完整版
  function convertInnerText() {
    var json_data = document.getElementById('content').innerText;
    if (json_data.includes('No')) return;
    json_data = JSON.parse(json_data);
    var attributesString = "";
    if (json_data) {
 

        Object.keys(json_data).forEach(function(key) {
            if (key == 'tagname') {
                attributesString += 't:' + json_data[key];
            } else if (key == 'innerText') {
                attributesString += '@@text()' + '=' + json_data[key];
            } else if (key == 'herf' || key == 'src') {
               //空操作
            } else {

                attributesString += '@@' + key + '=' + json_data[key];
            }
        });

        document.getElementById('convert').innerText = attributesString;
        

    } else {
        console.error('Element with id "content" not found.');
    }
}



function isJsonEmpty(json) {
  return JSON.stringify(json) === '{}';
}

function checkString(str) {
  return str.includes('id') || str.includes('class') || str.includes('innerText') ;
}


//创建自定义选择复选框

function createCheckboxes(jsonData) {
  // 获取div容器
  const container = document.getElementById('xuanze');

  // 清空容器中的内容
  container.innerHTML = '';

  // 遍历jsonData对象中的每个键值对
  for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
          // 创建一个label元素
          const label = document.createElement('label');
          label.textContent = key;

          // 创建一个checkbox元素
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = jsonData[key];
          if (key == 'tagname')
              checkbox.checked = true;
          if (key == 'id')
              checkbox.checked = true;             
          if (key == 'innerText')
              checkbox.checked = true;
          

          // 将checkbox添加到label中
          label.appendChild(checkbox);

          // 将label添加到容器中
          container.appendChild(label);

          // 添加一个换行符
          container.appendChild(document.createElement('br'));
      }
  }
}



//添加监听函数
function updateSelectedCheckboxes() {
  // 获取所有复选框
  const checkboxes = document.querySelectorAll('#xuanze input[type="checkbox"]');
  var xuanze_info='';

  checkboxes.forEach(checkbox => {

      // 检查是否选中
      if (checkbox.checked) {
          // 打印复选框的 value 和对应的 label 文本内容
          let k=checkbox.parentNode.textContent;
          
          let one_info= `@@${k}=${checkbox.value}`;
          if(k=='tagname') one_info=`t:${checkbox.value}`;
          if(k=='innerText') one_info=`@@text()=${checkbox.value}`;
          xuanze_info+=one_info;
      }
  });
  document.getElementById('xuanze_info').innerText=xuanze_info;
  window.DP=xuanze_info;
  if(xuanze_info)  document.getElementById('css_content').innerText=parseSpecialSyntax(xuanze_info);
  
}

// 获取 #test 元素
var testDiv = document.getElementById('xuanze');

// 添加监听事件，当复选框状态改变时调用 logSelectedCheckboxes 函数
if(testDiv){

  testDiv.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        updateSelectedCheckboxes();
    }
  });
}


// -------------------------复制按钮 监听部分
// 获取按钮元素
var copyBTN = document.getElementById('copy');
var copyBTN_css = document.getElementById('copy_css');

// 通用的复制函数
function copyToClipboard(elementId, button, successMessage, defaultMessage) {
  // 创建新的 textarea 元素，并设置其值为要复制的文本内容
  const textarea = document.createElement('textarea');
  textarea.value = document.getElementById(elementId).innerText;

  // 将 textarea 添加到文档中
  document.body.appendChild(textarea);

  // 选中 textarea 中的文本
  textarea.select();
  textarea.setSelectionRange(0, 99999); // 兼容性处理

  // 尝试执行复制操作
  document.execCommand('copy');

  // 移除 textarea 元素
  document.body.removeChild(textarea);

  // 在控制台打印成功信息
  console.log('已复制到剪贴板');
  button.innerText = successMessage;
  setTimeout(() => {
    button.innerText = defaultMessage;
  }, 1000);
}

// 添加复制事件监听器
copyBTN.addEventListener('click', () => {
  copyToClipboard('xuanze_info', copyBTN, '复制成功', '复制下面语法');
});

copyBTN_css.addEventListener('click', () => {
  copyToClipboard('css_content', copyBTN_css, '复制成功', '复制下面语法');
});

// ------------------------------

// 把官方语法转换成 css 语法
function parseSpecialSyntax(specialSyntax) {
    // 将特殊语法按 @@ 分割成数组
    const parts = specialSyntax.split('@@').filter(part => part.trim() !== '');

    // 初始化一个空的 CSS 选择器
    let cssSelector = '';

    // 使用 for 循环遍历每个属性部分
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        if (part.includes('t:')) {
            cssSelector +=  part.split(':')[1];
            continue;
        } 
        if (part.includes('text()')) {            
            continue;
        } 
        // 按 = 分割键和值
        let [key, value] = part.split('=');

        if (key === 'class') {
            let classes = value.split(' ').map(className => `.${className.trim()}`).join('');
            cssSelector += classes;
        } else {
            cssSelector += `[${key}=${value}]`;
        }
    }

    return cssSelector;
}



// 监听智能补全 按钮

var smart_fill_BTN=document.getElementById('smart_fill');
const meshi=change_meshi();
var DP_content=document.getElementById('xuanze_info');

smart_fill_BTN.addEventListener('click',()=>{

    // DP_content.innerText=`page.ele('${DP_content.innerText}').click()`
    meshi.changeMode();

});

//闭包函数
function change_meshi() {
    // 定义一个变量来存储当前的模式
    let currentMode = 0;
    

    // 获取按钮元素
    const modeButton = document.getElementById('smart_fill');

    // 定义点击按钮时触发的函数
    function changeMode() {
        let temp_content=[window.DP,`page('${window.DP}')`,`page('${window.DP}').click()`,`page('${window.DP}').input()`,`变量名=page('${window.DP}')`]
        // 切换到下一个模式
        currentMode = (currentMode + 1) % 5; // 取余操作实现循环
        modeButton.textContent = "智能补全模式" + currentMode;
        DP_content.innerText=temp_content[currentMode];

    }

    // 返回一个对象，包含可以调用的方法
    return {
        changeMode: changeMode
    };
}

