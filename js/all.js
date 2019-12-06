// DATA
const xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',true);
xhr.send(null);
xhr.onload = function(){
  if (xhr.status == 200) {
    var data = JSON.parse(xhr.response);
    console.log(data);
  } else {
    alert ('資料獲取失敗');
    return;
  }
  // 取出要給 option 的值
  // 篩選出所有OPTION 後加入陣列，但如果重複就不加入
  let zones = []; // 獲得所有 ZONE
  data.result.records.forEach(function(item){
    if (zones.indexOf(item.Zone) === -1) { // indexOf回傳 -1 的話表示 此item.zone 還沒在陣列中，因此找不到索引
      zones.push(item.Zone);
    }
  })
  // 把撈出來的option加入select
  const selects = document.querySelector('#zoneSelect');
  let optionTitle = `<option id='initOption'>--選擇行政區--</option>`
  zones.forEach(function(item){
    var options = `<option value="${item}">${item}</option>`
    optionTitle += options;
  })
  selects.innerHTML = optionTitle;
  //DOM元素取得
  const zoneSelect=document.querySelector('.zoneSelect');    //header'選擇'區 ul
  const hotZoneList = document.querySelector('.hotZoneList');//header熱門'點擊'區 ul
  const zoneTitle = document.querySelector('.zoneTitle');    //content h2
  const zoneList = document.querySelector('.zoneList');      //content 各地點資料 ul
  //事件監聽
  //讓click和change監聽同一個更新函式
  zoneSelect.addEventListener('change',showInfo);
  hotZoneList.addEventListener('click',showInfo);
  //頁面更新函式
  function showInfo(e){
    let hotzone = e.target.textContent; // 如果是點擊熱門區的話，取這個值
    const zoneContent = []; // 要計算個別區域有多少必資料用的
    const hotzones = ['苓雅區','三民區','岡山區','前鎮區']
    console.log(e);
    for(var i = 0;i < data.result.records.length; i++){
      //判斷 如果'選擇'的值等於zone 或 '點選'的內容等於zone 執行innerHTML更新
      if(e.target.value == data.result.records[i].Zone || e.target.textContent == data.result.records[i].Zone){
        if(hotzones.indexOf(hotzone) != -1) { // 如果取得的 e.target.textContent 的值 在 hotzones 裡的話 改變 select的value
          zoneSelect.value = hotzone ;
        }
        zoneTitle.textContent = data.result.records[i].Zone
        const Picture1 = data.result.records[i].Picture1;
        const Name = data.result.records[i].Name;
        const tagZone = data.result.records[i].Zone;
        const Opentime = data.result.records[i].Opentime;
        const Add = data.result.records[i].Add;
        const Tel = data.result.records[i].Tel;
        let Ticketinfo = data.result.records[i].Ticketinfo;
        if(!Ticketinfo) {
          Ticketinfo = '無收費資訊';
        }
        zoneContent.push({
          Picture1,
          Name,
          tagZone,
          Opentime,
          Add,
          Tel,
          Ticketinfo
        });
      }
      // 預設顯示第1頁內容
      let defaultStr = '';
      zoneContent.forEach((item, key) => {
        if ((key + 1) >= 1 && (key + 1) <= 4 ) {
          defaultStr += '<li class="zoneLi"><div class="areaPhoto" style="background-image: url('+item.Picture1+')"><div class="areaName"> '+item.Name+'</div><div class="tagZone">'+item.tagZone+'</div></div>'+'<div class="areaInfo"><img src="./images/icons_clock.png" class="floatImg" ><div class="optimeDiv">'+item.Opentime+'</div><div class="clearfix"></div></br><img src="./images/icons_pin.png" class="floatImg" ><div class="addDiv">'+item.Add+'</div><div class="clearfix"></div></br><img src="./images/icons_phone.png" class="floatImg" ><div class="phoneDiv">'+item.Tel+'</div><div class="clearfix"></div><div class="ticketInfo">'+item.Ticketinfo+'</div><img src="./images/icons_tag.png"  class="floatTicket" ><div class="clearfix"></div></li>'
        }
      })
      zoneList.innerHTML = defaultStr + '<div class="clearfix"></div>';
    }
    document.querySelector('#initOption').setAttribute('disabled','true'); // 選擇城市後 disabled 請選擇
    // 分頁
    let pagination = document.querySelector('.pagination');
    const perPage = 4; // 每頁顯示資料數
    const resultNum = zoneContent.length; // 各區資料數
    const totalPage = Math.ceil(resultNum / perPage); // 總頁數 = 各區資料數 / 每頁顯示數 ， 並無條件進位
    console.log(totalPage > 1);
    let pages = '';
    if(totalPage > 1) { // 總頁數超過 1 才顯示分頁
      for (let i = 1 ; i <= totalPage ; i++) {
        pages += `<li class="page-item"><a class="page-link" data-page=${i} href="#">${i}</a></li>`
      }
      // 渲染分頁數
      pagination.innerHTML = `
      <li class="page-item page-pre"><a class="page-link page-link-pre" data-to = "-1"  href="#"> < </a></li>
      ${pages}
      <li class="page-item page-next"><a class="page-link page-link-next" data-to = "1"  href="#"> > </i></a></li>
      `;
      console.dir(pagination);
      const firstPage = pagination.children[1];
      document.querySelector('.page-link-pre').setAttribute('disabled',true); // 因為預設為第1頁 把上1頁按鈕 disabled;
      document.querySelector('.page-link-pre').classList.add('a-disbled');    // 因為預設為第1頁 增加 a-disbled Class
      document.querySelector('.page-pre').classList.add('item-disbled');      // 因為預設為第1頁 增加 item-disbled Class
      firstPage.classList.add('active');
      firstPage.children[0].setAttribute('style','color:white');
      // 監聽分頁點擊事件
      pagination.addEventListener('click', function (e) {
        e.preventDefault();
        let currentPage = 1;
        let actviePage = 1;
        if (e.target.dataset.to && e.target.nodeName === "A") { // 點擊上下頁
          document.querySelectorAll('.page-item').forEach((item, key) => {
            if (item.className.match('active')) { // 找出 className 裡有 active 的目標 ，取得他的索引讓它等於 目前頁面
              actviePage = key;
            }
          });
          currentPage = actviePage + Number(e.target.dataset.to); // 索引從 pre 開始算所以不用 + 1
          document.querySelectorAll('.page-link').forEach(item => { // 把所有頁碼 a 的父元素 li 的 active class 清空
            // item.classList.remove('active');
            item.parentElement.classList.remove('active');
            item.setAttribute('style','');
          })
          pagination.children[currentPage].classList.add('active'); // 針對 currentpage 為 key 的節點 加上 active
          pagination.children[currentPage].children[0].setAttribute('style','color:white');   // 針對 currentpage 為 key 的節點 頁碼變成白色
          let minShow = currentPage * perPage - perPage + 1;  // 每頁顯示的第1筆資料在所有資料中的順序
          let maxShow = currentPage * perPage;                // 每頁顯示的最後1筆資料在所有資料中的順序
          let hasPre = currentPage > 1;                       // 檢查是否有上一頁 ， 如果 目前頁數大於 1 就是有
          let hasNext = currentPage < totalPage;              // 檢查是否有下一頁 ， 如果 目前頁數小於 總頁數 就是有
          let showStr = '';
          zoneContent.forEach((item, key) => {
            if (!item.Ticketinfo) {
              item.Ticketinfo = '無收費資訊';
            }
            if ((key + 1) >= minShow && (key + 1) <= maxShow) { // 點擊頁碼後要顯示到此頁碼的範圍資料
              showStr += '<li class="zoneLi"><div class="areaPhoto" style="background-image: url('+item.Picture1+')"><div class="areaName"> '+item.Name+'</div><div class="tagZone">'+item.tagZone+'</div></div>'+'<div class="areaInfo"><img src="./images/icons_clock.png" class="floatImg" ><div class="optimeDiv">'+item.Opentime+'</div><div class="clearfix"></div></br><img src="./images/icons_pin.png" class="floatImg" ><div class="addDiv">'+item.Add+'</div><div class="clearfix"></div></br><img src="./images/icons_phone.png" class="floatImg" ><div class="phoneDiv">'+item.Tel+'</div><div class="clearfix"></div><div class="ticketInfo">'+item.Ticketinfo+'</div><img src="./images/icons_tag.png"  class="floatTicket" ><div class="clearfix"></div></li>'
            }
            zoneList.innerHTML = showStr+'<div class="clearfix"></div>';
          })
          console.log(document.querySelector('.page-pre'));
          if (!hasPre) {
            document.querySelector('.page-link-pre').setAttribute('disabled',true);
            document.querySelector('.page-link-pre').classList.add('a-disbled');
            document.querySelector('.page-pre').classList.add('item-disbled');
          } else {
            document.querySelector('.page-link-pre').setAttribute('disabled', false);
            document.querySelector('.page-link-pre').classList.remove('a-disbled');
            document.querySelector('.page-pre').classList.remove('item-disbled');
          }
          if (!hasNext) {
            document.querySelector('.page-link-next').setAttribute('disabled', true);
            document.querySelector('.page-link-next').classList.add('a-disbled');
            document.querySelector('.page-next').classList.add('item-disbled');
          } else {
            document.querySelector('.page-link-next').setAttribute('disabled', false);
            document.querySelector('.page-link-next').classList.remove('a-disbled');
            document.querySelector('.page-next').classList.remove('item-disbled');
          }
        } else if (e.target.nodeName === "A") { // 確保點到 頁碼 連結
          console.log(e);
          console.log(document.querySelectorAll('.page-link'));
          document.querySelectorAll('.page-link').forEach(item => { // 把所有頁碼 a 的父元素 li 的 active class 清空
            // item.classList.remove('active');
            item.parentElement.classList.remove('active');
            item.setAttribute('style','');
          })
          e.target.parentElement.classList.add('active'); // 給點擊的頁碼 的父元素 li 增加 actvie class
          e.target.setAttribute('style','color:white');   // 給點擊的頁碼顏色變白
          currentPage = e.target.dataset.page;            // 目前所在頁數
          if (currentPage > totalPage) {                  // 目前頁數無論如何都不能大於總頁數，如果 目前所在頁數 比 總頁數 大就讓 目前頁數 等於 總頁數頁碼
            currentPage = totalPage;
          }
          let minShow = currentPage * perPage - perPage + 1;  // 每頁顯示的第1筆資料在所有資料中的順序
          let maxShow = currentPage * perPage;                // 每頁顯示的最後1筆資料在所有資料中的順序
          let hasPre = currentPage > 1;                       // 檢查是否有上一頁 ， 如果 目前頁數大於 1 就是有
          let hasNext = currentPage < totalPage;              // 檢查是否有下一頁 ， 如果 目前頁數小於 總頁數 就是有
          let showStr = '';
          zoneContent.forEach((item, key) => {
            if (!item.Ticketinfo) {
              item.Ticketinfo = '無收費資訊';
            }
            if ((key + 1) >= minShow && (key + 1) <= maxShow) { // 點擊頁碼後要顯示到此頁碼的範圍資料
              showStr += '<li class="zoneLi"><div class="areaPhoto" style="background-image: url('+item.Picture1+')"><div class="areaName"> '+item.Name+'</div><div class="tagZone">'+item.tagZone+'</div></div>'+'<div class="areaInfo"><img src="./images/icons_clock.png" class="floatImg" ><div class="optimeDiv">'+item.Opentime+'</div><div class="clearfix"></div></br><img src="./images/icons_pin.png" class="floatImg" ><div class="addDiv">'+item.Add+'</div><div class="clearfix"></div></br><img src="./images/icons_phone.png" class="floatImg" ><div class="phoneDiv">'+item.Tel+'</div><div class="clearfix"></div><div class="ticketInfo">'+item.Ticketinfo+'</div><img src="./images/icons_tag.png"  class="floatTicket" ><div class="clearfix"></div></li>'
            }
            zoneList.innerHTML = showStr+'<div class="clearfix"></div>';
          })
          console.log(document.querySelector('.page-pre'));
          if (!hasPre) {
            document.querySelector('.page-link-pre').setAttribute('disabled',true);
            document.querySelector('.page-link-pre').classList.add('a-disbled');
            document.querySelector('.page-pre').classList.add('item-disbled');
          } else {
            document.querySelector('.page-link-pre').setAttribute('disabled', false);
            document.querySelector('.page-link-pre').classList.remove('a-disbled');
            document.querySelector('.page-pre').classList.remove('item-disbled');
          }
          if (!hasNext) {
            document.querySelector('.page-link-next').setAttribute('disabled', true);
            document.querySelector('.page-link-next').classList.add('a-disbled');
            document.querySelector('.page-next').classList.add('item-disbled');
          } else {
            document.querySelector('.page-link-next').setAttribute('disabled', false);
            document.querySelector('.page-link-next').classList.remove('a-disbled');
            document.querySelector('.page-next').classList.remove('item-disbled');
          }
        }
      });
    } else { // 總頁數沒有大於 1 就清除分頁
      pagination.innerHTML = '';
    }
  };


};






