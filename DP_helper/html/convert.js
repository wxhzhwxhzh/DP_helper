


var extract_code = '(function() { \
var elem = $0; \
if (elem) { \
    var attributes = {"tagname":elem.tagName.toLowerCase()}; \
    var attributeNames = elem.getAttributeNames(); \
    attributeNames.forEach(function(attr) { \
        attributes[attr] = elem.getAttribute(attr); \
    }); \
    var innerText = elem.innerText.trim(); \
    if (innerText !== ""  && innerText.length <20) { \
        attributes["innerText"] = innerText;  \
    } \
    return JSON.stringify(attributes, null, 2); \
} else { \
    return "No element selected or element has no ID"; \
} \
})()';


// 在插件的 devtools 页面中监听元素选择事件
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    // 获取当前选中的元素
    chrome.devtools.inspectedWindow.eval(
        extract_code, // $0 refers to the currently selected element in the Elements panel
        (result, isException) => {
            if (isException) {
                console.error('Error:', isException);
            } else {
                console.log('返回结果:', result);
                window.info=result;
                document.getElementById('content').innerText=result;
                convertInnerText();
                convertInnerText_simple();
            }
        }
    );
  });
  
  

  function convertInnerText() {
    var json_data = document.getElementById('content').innerText;
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

function convertInnerText_simple() {
    var json_data = document.getElementById('convert').innerText;
    
    var attributesString = "";
    if(json_data){
      let  arr=json_data.split('@@');
      for (var i = 0; i < arr.length; i++) {
        if (i==0) {
          attributesString += arr[i];
        } 
         if(checkString(arr[i])){
          attributesString += '@@' + arr[i];
          break;
         };
    }

    }
  

        document.getElementById('simple_convert').innerText = attributesString;        

  
}

console.log(1231213);

function isJsonEmpty(json) {
  return JSON.stringify(json) === '{}';
}

function checkString(str) {
  return str.includes('id') || str.includes('class') || str.includes('innerText') ;
}