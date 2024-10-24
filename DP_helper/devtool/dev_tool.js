chrome.devtools.panels.elements.createSidebarPane('💖️骚神语法转换', function (sidebar) {
    // sidebar initialization code here
    sidebar.setPage('html/convert.html')
    
    // sidebar.onShown.addListener(handleShown)
    // sidebar.onHidden.addListener(handleHidden)
  });

chrome.devtools.panels.elements.createSidebarPane('🔴骚神逆向助手', function (sidebar) {
    sidebar.setPage('html/reverse.html')
  });  


  chrome.devtools.panels.create('🔵抓包助手', 'icon.png', 'html/demo.html', () => {
    console.log('user switched to🔵抓包助手');
  });
  chrome.devtools.panels.create('📘代码生成', 'icon.png', 'code_helper.html', () => {
    console.log('user switched to代码生成助手');
    
  });
  
  chrome.devtools.panels.create('📗cURL助手', 'icon.png', 'html/curl_helper.html', () => {
    console.log('user switched to📗异步助手');
  }); 
 
  chrome.devtools.panels.create('🔴K哥工具箱', 'icon.png', 'html/K_ge.html', () => {
    console.log('user switched to🔴K哥工具箱');
  });  


  chrome.devtools.panels.create('📙AI对话', 'icon.png', 'html/teach_doc.html', () => {
    console.log('user switched to📙AI对话');
  });  

  // chrome.devtools.panels.create('🔴高手进阶', 'icon.png', 'html/jin_jie.html', () => {
  //   console.log('user switched to🔴高手进阶');
  // });


 
  