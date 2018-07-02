
$(function() {

  var id = getSearch("productId");
  $.ajax({
    url: "/product/queryProductDetail",
    type: "get",
    data: {
      id: id
    },
    dataType: "json",
    success: function (info) {
      console.log(info);
      var htmlStr = template("tmp", info);
      $(".mui-scroll").html(htmlStr);
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 动态渲染,需要手动初始化数字输入框
      mui(".mui-numbox").numbox();
    } 
  })

  //点击span盒子,添加上current类名
    // 用户选择尺码功能
  $(".lt_main").on("click", ".lt_size span", function () {
    $(this).addClass("current").siblings().removeClass("current");
  })

    // 2. 加入购物车功能
  // (1) 给按钮添加点击事件
  // (2) 获取用户选择的尺码和数量,  (用户要能选)
  // (3) 发送 ajax 请求, 加入购物车
  $(".addCart").click(function () {
    var num = $(".lt_num input").val(); //产品的数量
    var size = $(".lt_size span.current").text(); //产品的尺码

    if(!size) {
      mui.toast("请选择尺码");
      return;
    }
    
    $.ajax({
      url: "/cart/addCart",
      type: "post",
      data: {
        size: size,
        num: num,
        productId: id
      },
      success: function (info) {
        console.log(info)
        if(info.success) {
          //说明用户应该登陆,跳转到购物车页面
          //通过mui确认框,提示用户添加成功
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            if(e.index === 0) {
              //前往购物车
              location.href = "./cart.html";
            }
          })
        } 
        if(info.error === 400) {
          // 跳转到登陆页, 将来登陆成功需要跳回来, 需要将当前的url传递过去
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })
  })


})