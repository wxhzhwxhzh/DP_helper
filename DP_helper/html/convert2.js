function createRadioButtons(options) {
    var optionDiv = document.getElementById('option');

    // 清空原有内容
    optionDiv.innerHTML = '';

    // 遍历数组中的每个选项，创建单选框并添加到 div 中
    options.forEach(function (optionText, index) {
        // 创建单选框
        var radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'option'; // 设置相同的 name，确保单选效果
        radioButton.value = optionText;
        radioButton.style.marginBottom = '5px';

        // 如果是第一个选项，设置为选中状态
        if (index === 0) {
            radioButton.checked = true;
        }


        // 创建标签 <label> 并设置文本内容为选项文字
        var label = document.createElement('label');
        label.textContent = optionText;
        label.style.marginRight = '10px';

        // 将单选框和标签添加到 div 中
        label.appendChild(radioButton);
        optionDiv.appendChild(label);

        // 添加换行符
        // optionDiv.appendChild(document.createElement('br'));
    });
}


var optionsArray = ['不修饰', 'page', 'click()', 'input()', 'text','相对定位'];

// 调用函数，传入数组参数
createRadioButtons(optionsArray);



//  监听智能补全 单选框的点击事件
document.getElementById('option').addEventListener('click', function (event) {
    this.querySelectorAll('input[name="option"]').forEach((r) => {
        if(r.checked){
            console.log('被选中 ',r.value);
            update_smart_fill(r);
        }
    })
})
;

function update_smart_fill(ele) {
    let temp = 'erro';
    var DP_content = document.getElementById('xuanze_info');
    var temp_content = [window.DP, `page('${window.DP}')`, `page('${window.DP}').click()`, `page('${window.DP}').input()`, `page('${window.DP}').text`]
    if (ele.checked) {
        console.log(ele.value); // 打印选中的单选框的值
        console.log(window.DP); // 打印选中的单选框的 DOM 元素.
        switch (ele.value) {
            case '不修饰':
                temp = temp_content[0];
                break;
            case 'page':
                temp = temp_content[1];
                break;
            case 'click()':
                temp = temp_content[2];
                break;
            case 'input()':
                temp = temp_content[3];
                break;
            case 'text':
                temp = temp_content[4];
                break;
            case '相对定位':
                temp =`page('${toDP_yufa(window.info_father)}').after('t:${window.info_json.tagname}')` ;
                break;
            default:
                temp = 'erro'
        }
        DP_content.innerText = temp;
    }
}

function toDP_yufa(json_string){
    let temp_json=JSON.parse(json_string);
    let temp_string='t:'+temp_json.tagname;
    if(temp_json.id){
        temp_string+='@@id='+temp_json.id;
        return temp_string;
    };
    if(temp_string.innerText){
        temp_string+='@@text()='+temp_json.innerText;
        return temp_string;
    }
    return temp_string;


}