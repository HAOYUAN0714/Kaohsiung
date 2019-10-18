// DATA
var xhr = new XMLHttpRequest();
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
  var zones = []; // 獲得所有 ZONE
  data.result.records.forEach(function(item){
    if (zones.indexOf(item.Zone) === -1) { // indexOf回傳 -1 的話表示 此item.zone 還沒在陣列中，因此找不到索引
      zones.push(item.Zone);
    }
  })
  // 把撈出來的option加入select
  var selects = document.querySelector('#zoneSelect');
  var optionTitle = `<option id='initOption'>--選擇行政區--</option>`
  zones.forEach(function(item){
    var options = `<option value="${item}">${item}</option>`
    optionTitle += options;
  })
  selects.innerHTML = optionTitle;
  //DOM元素取得
  var zoneSelect=document.querySelector('.zoneSelect');    //header'選擇'區 ul
  var hotZoneList = document.querySelector('.hotZoneList');//header熱門'點擊'區 ul
  var zoneTitle = document.querySelector('.zoneTitle');    //content h2
  var zoneList = document.querySelector('.zoneList');      //content 各地點資料 ul
  //事件監聽
  //讓click和change監聽同一個更新函式
  zoneSelect.addEventListener('change',showInfo);
  hotZoneList.addEventListener('click',showInfo);
  //頁面更新函式
  function showInfo(e){
    var str = '' ;//用來組成zoneList內容
    var hotzone = e.target.textContent; // 如果是點擊熱門區的話，取這個值
    var hotzones = ['苓雅區','三民區','岡山區','前鎮區']
    console.log(e);
    for(var i =0;i<data.result.records.length;i++ ){
      //判斷 如果'選擇'的值等於zone 或 '點選'的內容等於zone 執行innerHTML更新
      if(e.target.value == data.result.records[i].Zone || e.target.textContent == data.result.records[i].Zone){
        if(hotzones.indexOf(hotzone) != -1) { // 如果取得的 e.target.textContent 的值 在 hotzones 裡的話 改變 select的value
          zoneSelect.value = hotzone ;
        }
        zoneTitle.textContent = data.result.records[i].Zone
        var Picture1 = data.result.records[i].Picture1;
        var Name = data.result.records[i].Name;
        var tagZone = data.result.records[i].Zone;
        var Opentime = data.result.records[i].Opentime;
        var Add = data.result.records[i].Add;
        var Tel = data.result.records[i].Tel;
        var Ticketinfo = data.result.records[i].Ticketinfo;
        if(!Ticketinfo) {
          Ticketinfo = '無收費資訊';
        }
        //innerHTML更新內容
        str+='<li class="zoneLi"><div class="areaPhoto" style="background-image: url('+Picture1+')"><div class="areaName"> '+Name+'</div><div class="tagZone">'+tagZone+'</div></div>'+'<div class="areaInfo"><img src="images/icons_clock.png" class="floatImg" ><div class="optimeDiv">'+Opentime+'</div><div class="clearfix"></div></br><img src="images/icons_pin.png" class="floatImg" ><div class="addDiv">'+Add+'</div><div class="clearfix"></div></br><img src="images/icons_phone.png" class="floatImg" ><div class="phoneDiv">'+Tel+'</div><div class="clearfix"></div><div class="ticketInfo">'+Ticketinfo+'</div><img src="images/icons_tag.png"  class="floatTicket" ><div class="clearfix"></div></li>'
      }
    }
    zoneList.innerHTML = str+'<div class="clearfix"></div>'; //因innerHTML特性 為了避免<ul>被<li>的float擠掉加上clearfix;
    document.querySelector('#initOption').setAttribute('disabled','true'); // 選擇城市後 disabled 請選擇

  };
};






