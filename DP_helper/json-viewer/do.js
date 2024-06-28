


function elementToJson(element) {
    const obj = {
        tag: element.tagName.toLowerCase(),
        attributes: {},
        children: []
    };

    // 获取属性
    for (let attr of element.attributes) {
        obj.attributes[attr.name] = attr.value;
    }

    // 递归处理子元素
    for (let child of element.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            obj.children.push(elementToJson(child));
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            obj.children.push({
                text: child.textContent.trim()
            });
        }
    }

    return obj;
}

function htmlToJson() {
    const bodyElement = document.querySelector('body');
    const jsonResult = elementToJson(bodyElement);
    return JSON.stringify(jsonResult, null, 2);
}



// 调用函数并打印结果
var  result_json=htmlToJson();
console.log(result_json);
$('#json-input').val(result_json);

// iframe页面接受不同域的信息
window.addEventListener('message', function(event) {
    // 检查源是否可信
    if (event.origin !== 'https://parent-page-domain.com') {
      console.log(event); // 来源不匹配，不处理消息
    }
  
    console.log('Received message from parent:', event.data);
    content_data=htmlToJson(event.data);
    $('#json-input').val(content_data);
    // 可以在这里根据接收到的数据执行相应的操作
  }, false);

//转换格式

$(function () {
    function renderJson() {
        try {
            // var input = eval('(' + $('#json-input').val() + ')');
            var input =JSON.parse($('#json-input').val())  ;
        }
        catch (error) {
            return alert("Cannot eval JSON: " + error);
        }
        var options = {
            collapsed: $('#collapsed').is(':checked'),
            rootCollapsable: $('#root-collapsable').is(':checked'),
            withQuotes: $('#with-quotes').is(':checked'),
            withLinks: $('#with-links').is(':checked')
        };
        $('#json-renderer').jsonViewer(input, options);
    }

    // Generate on click
    $('#btn-json-viewer').click(renderJson);

    // Generate on option change
    $('p.options input[type=checkbox]').click(renderJson);

    // Display JSON sample on page load
    renderJson();
});

// 把网页源代码变成json字符串.
function htmlToJson(htmlSource) {
    // 创建一个新的DOM对象
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlSource, 'text/html');

    // 将DOM对象转换为JSON对象的函数
    function domToJson(node) {
        let obj = {};
        // 处理节点类型
        obj.type = node.nodeType;
        // 处理节点名称
        obj.name = node.nodeName;
        // 处理节点的值
        if (node.nodeValue) {
            obj.value = node.nodeValue;
        }
        // 处理节点的属性
        if (node.attributes && node.attributes.length > 0) {
            obj.attributes = {};
            for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i];
                obj.attributes[attr.nodeName] = attr.nodeValue;
            }
        }
        // 处理子节点
        if (node.childNodes && node.childNodes.length > 0) {
            obj.children = [];
            for (let i = 0; i < node.childNodes.length; i++) {
                obj.children.push(domToJson(node.childNodes[i]));
            }
        }
        return obj;
    }

    // 将整个HTML文档转换为JSON格式
    let jsonOutput = domToJson(doc.documentElement);
    return JSON.stringify(jsonOutput, null, 2);

    return jsonOutput;
}
