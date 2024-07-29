


var extract_code_ele = '(function() { \
var elem = $0; \
if (elem) {return elem.outerHTML \
} \
})()';
var extract_code_ele_father = '(function() { \
var elem = $0; \
if (elem) {return elem.parentNode.outerHTML \
} \
})()';



function outerHTMLToJSON(outerHTML) {
    // 创建一个临时 div 元素
    var tempDiv = document.createElement('div');
    
    // 将传入的 outerHTML 赋值给临时 div 的 innerHTML，这样浏览器会自动解析它
    tempDiv.innerHTML = outerHTML;
    
    // 从临时 div 中获取第一个子元素（即刚刚解析的那个元素）
    var element = tempDiv.firstChild;
    
    if (element) {
        // 初始化一个空对象，用于存储元素信息
        var attributes = { "tagname": element.tagName.toLowerCase() };
        
        // 获取元素所有的属性名
        var attributeNames = Array.from(element.attributes).map(attr => attr.name);
        
        // 遍历属性名数组，将每个属性名及其对应的值添加到 attributes 对象中
        attributeNames.forEach(function(attr) {
            attributes[attr] = element.getAttribute(attr);
        });
        
        // 获取元素的innerText，并去除两端的空白字符
        var innerText = element.innerText;
        
        // 如果innerText不为空且长度小于20个字符，则将其加入到 attributes 对象中
        if (innerText !== "" && innerText.length < 20) {
            attributes["innerText"] = innerText;
        }
        
        // 使用JSON.stringify将attributes对象转换为格式化的JSON字符串
        return   JSON.stringify(attributes, null, 2);
    } else {
        // 如果未能从outerHTML中解析出有效的元素，则返回相应的提示信息
        return "Invalid outerHTML provided";
    }
}


// 第一次加载的时候执行一次
main_job();

// 在插件的 devtools 页面中监听元素选择事件
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    main_job();    
  });

  document.body.outerHTML


//   主函数
function main_job() {
    // 获取当前选中的元素
    chrome.devtools.inspectedWindow.eval(
        extract_code_ele, // $0 refers to the currently selected element in the Elements panel
        (result, isException) => {
            result=outerHTMLToJSON(result);
            if (result == "No element selected") return;
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('返回--结果:', result);
                window.info = result;
                window.info_json = JSON.parse(result);
                document.getElementById('content').innerText = result;
                //  把json版转换成 完整版
                convertInnerText();
                //创建自定义选择复选框                
                createCheckboxes(JSON.parse(result));
                updateSelectedCheckboxes();
            }
        }
    );
    chrome.devtools.inspectedWindow.eval(
        extract_code_ele_father, 
        (result, isException) => {
            result=outerHTMLToJSON(result);            
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('返回元素结果:', result);
                window.info_father = result;
                window.info_father_json = JSON.parse(result);
               
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
        //   container.appendChild(document.createElement('br'));
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
        document.getElementById('option').click();
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


