chrome.devtools.panels.elements.createSidebarPane('💖️骚神语法转换', function (sidebar) {
    // sidebar initialization code here
    sidebar.setPage('html/convert.html')
    // sidebar.onShown.addListener(handleShown)
    // sidebar.onHidden.addListener(handleHidden)
  });

  


  chrome.devtools.panels.create('🔵抓包助手', 'icon.png', 'html/demo.html', () => {
    console.log('user switched to🔵抓包助手');
  });
  chrome.devtools.panels.create('📘代码生成', 'icon.png', 'code_helper.html', () => {
    console.log('user switched to代码生成助手');
    
  });
  
  chrome.devtools.panels.create('📗DP文档速查', 'icon.png', 'html/dp_doc.html', () => {
    console.log('user switched to📗DP文档速查');
  });
  
  chrome.devtools.panels.create('📙实战代码', 'icon.png', 'html/teach_doc.html', () => {
    console.log('user switched to📙实战代码');
  });  

  chrome.devtools.panels.create('🔴高手进阶', 'icon.png', 'html/jin_jie.html', () => {
    console.log('user switched to🔴高手进阶');
  });


 
  