
//逆向代码
console.log('逆向助手 - 开始执行代码');


function hook_response_json() {
    // 保存原始的 Response 原型上的 json 方法
    const originalResponseJson = Response.prototype.json;

    // 改写 Response 原型上的 json 方法
    Response.prototype.json = async function () {
        // 调用原始的 json 方法获取原始数据
        const originalJson = await originalResponseJson.apply(this);

        // 在控制台打印返回的 JSON 数据
        console.log('逆向助手 -Response JSON:', JSON.stringify(originalJson));

        // 返回原始的 Json 数据
        return originalJson;
    };
    console.log('Response JSON hook成功');
}

hook_response_json();


