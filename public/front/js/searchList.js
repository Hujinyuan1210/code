$(function () {

  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var key = getSearch("key");
  $(".search_input").val(key);
  // console.log(key)
  render();

  //发送ajax请求数据 渲染页面
  // 功能, 获取搜索框的值, 发送ajax请求, 进行页面渲染
  function render() {

    $(".lt_product").html('<div class="loading"></div>');
    //三个必传的参数 
    var params = {};
    params.proName = $(".search_input").val();
    params.page = 1;
    params.pageSize = 100;
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
          var htmlStr = template("tmp", info);
          $(".lt_product").html(htmlStr);
        }
      })
    },1000)
  }


  // 2. 点击搜索按钮, 进行搜索功能
  $(".search_btn").click(function () {
    var key = $(".search_input").val();
    if (key === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    render();

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

  $(".lt_sort a[data-type]").click(function () {

    if ($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    //重新渲染
    render();
  })



})