
$(function () {
  //初始化scroll控件
  mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
  });
})

function getSearch(name) {
  //获取地址栏上的参数
  var search = location.search;
  //对中文进行解码
  search = decodeURI(search);
  //切割
  search = search.slice(1);
  //以&分开转换成数组
    var arr = search.split("&");
    var obj = {};
  arr.forEach(function (v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value;
  })
  return obj[name];
}