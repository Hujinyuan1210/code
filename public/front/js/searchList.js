$(function () {

  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var key = getSearch("key");
  $(".search_input").val(key);

  var currentPage = 1; //表示当前页
  var pageSize = 4; //每页4条数据


  //发送ajax请求数据 渲染页面
  // 功能, 获取搜索框的值, 发送ajax请求, 进行页面渲染
  function render(callback) {

    //三个必传的参数 
    var params = {};
    params.proName = $(".search_input").val();
    params.page = currentPage;
    params.pageSize = pageSize;
    //还有两个可传的参数 price 和 num
    //根据当前高亮的a来决定按什么排序
    var $current = $(".lt_sort .current");
    if ($current.length > 0) {
      //说明有高亮,需要排序
      var sortName = $current.data("type"); //排序名称
      var sortValue = $current.find("i").hasClass("fa fa-angle-down") ? 2 : 1; //排序的值
      params[sortName] = sortValue;
    }

    setTimeout(function () {
      $.ajax({
        url: "/product/queryProduct",
        type: "get",
        data: params,
        dataType: "json",
        success: function (info) {
          // console.log(info);
          callback && callback(info);
        }
      })
    }, 500)
  }

  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //下拉
      down: {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        callback: function () {
          currentPage = 1;
          render(function (info) {
            var htmlStr = template("tmp", info);
            $(".lt_product").html(htmlStr);
            //数据回来之后需要关闭下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            ;

            //下拉刷新完成后,重新渲染了第一页, 又有更多数据可以加载了
            //需要重新启动上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
          });
        }
      },
      //上拉加载更多
      up: {
        callback: function () {
          currentPage++;
          render(function (info) {
            //渲染追加完成,需要关闭上拉加载
            //就说明没有数据了
            if (info.data.length === 0) {
              //给endPullupToRefresh() 传参 true就会显示没有更多数据了.并且禁用上拉加载了
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            } else {
              // 如果有数据,需要进行渲染,渲染完成,正常关闭上拉下载
              var htmlStr = template("tmp", info);
              $(".lt_product").append(htmlStr);
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh();
            }

          })
        }
      }
    }
  });

  //tap表示轻触,轻轻的摸
  //mui中认为click事件,有延迟,有300ms的延迟
  $(".lt_product").on("tap", "a", function () {
    var id = $(this).data("id");
    location.href = "product.html?productId=" + id;
  })

  // 2. 点击搜索按钮, 进行搜索功能
  $(".search_btn").click(function () {

    
    var key = $(".search_input").val();
    if (key === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    // 如果用户输入了内容,说明需要进行内容更新,搜索新内容
    // 之前用的是render,现在可以直接通过直接调用一次下拉刷新 api 触发一次下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

    //获取数组
    var history = localStorage.getItem("search_list");
    var arr = JSON.parse(history);

    var index = arr.indexOf(key);
    //判断数组中有没有刚输入的,有就把之前的删了
    if (index > -1) {
      arr.splice(index, 1);
    }
    //不能超过8个
    if (arr.length >= 8) {
      arr.pop();
    }
    //将刚输入的添加到数组中
    arr.unshift(key);
    //存储到localStorage 中
    localStorage.setItem("search_list", JSON.stringify(arr));

    //清空搜索框的内容
    $(".search_input").val("");

  })

  // 3. 添加排序功能
  // (1) 添加点击事件
  // (2) 如果没有current, 就要加上current, 并且其他 a 需要移除 current
  //     如果有 current, 切换小箭头方向即可
  // (3) 页面重新渲染

  $(".lt_sort a[data-type]").on("tap", function () {

    if ($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    //重新渲染
    // 之前用的是render,现在可以直接通过直接调用一次下拉刷新 api 触发一次下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

  })



})