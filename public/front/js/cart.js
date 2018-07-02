
$(function () {

  function render() {
    setTimeout(function () {
      $.ajax({
        url: "/cart/queryCart",
        type: "get",
        dataType: "json",
        success: function (info) {
          // console.log(info);
          var htmlStr = template("tmp", { list: info });
          $("#items").html(htmlStr);
          // 页面渲染完成结束下拉刷新
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

        }
      })
    }, 500)
  }
  //配置下拉刷新
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        callback: function () {
          render();
        }
      }
    }
  });

  //删除购物车
  $(".mui-scroll-wrapper").on("tap", "#delBtn", function () {
    var id = $(this).data("id");
    $.ajax({
      url: "/cart/deleteCart",
      type: "get",
      dataType: "json",
      data: {
        id: [id]
      },
      success: function (info) {
        // console.log(info);
        if(info.success) {
          mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
        }
      }

    })

  })
  

  //点击修改
  $(".mui-scroll-wrapper").on("tap", "#btn_edit", function() {
    //原生js:获取所有的自定义属性，是一个对象
     var obj = this.dataset;
     console.log(obj);
    var htmlStr = template("editTpl", obj);
    htmlStr = htmlStr.replace(/\n/g, "");
    //显示确认框
    mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function(e) {
      var id = obj.id;
      var size = $(".lt_size span.current").text(); //获取尺码
      var num = $(".lt_num input").val(); //获取数量
      console.log(size,num);
      
      if(e.index === 0) {
        // console.log(e);
        
        $.ajax({
          url: "/cart/updateCart",
          type: "post",
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function (info) {
            console.log(info)
            if(info.success) {
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
          
        })
      
      }
    })

    //手动初始化数字框
    mui(".mui-numbox").numbox();
    
    //添加尺码选择功能
    $("body").on("click", ".lt_size span", function () {
      $(this).addClass("current").siblings().removeClass("current");
    })

  })

  // 计价功能
  $(".lt_main").on("click", "#ck", function () {
    var $all = $(".lt_main #ck:checked");
    // console.log(all)
    var total = 0;
    $all.each(function (index, ele) {
      //获取num 和 price
      var num = $(this).data("num");
      var price = $(this).data("price");
      total += num * price;
    })
    total = total.toFixed(2);
    $("#totalText").html(total);
  })
  
})