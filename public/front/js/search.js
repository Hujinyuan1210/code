$(function () {

  // 功能1: 搜索历史记录渲染功能
  // (1) 获取本地存储中存储的数据 jsonStr
  // (2) 转换成数组
  // (3) 将数组, 通过模板引擎渲染历史记录

  render();
  //获取localStorage 的数组
  function getHistory() {
    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(history);
    return arr;
  }

  // 渲染功能
  function render() {
    var arr = getHistory();
    // console.log(arr);
    var htmlStr = template("tmp", {
      arr: arr
    });
    $(".lt_history").html(htmlStr);
  }
  // 功能2: 清空历史记录功能
  // (1) 给清空按钮添加点击事件, 通过事件委托
  // (2) 将 search_list 从本地存储中删除  使用 removeItem
  // (3) 页面需要重新渲染
  $(".lt_history").on("click", ".icon_empty", function () {
    //.confirm(message, title, btnValue, callback[, type])
    mui.confirm("你确定要清空全部的历史记录么?", "温馨提示", ["取消", "确认"], function (e) {
      //  console.log(e);
      //表示按得是确认按钮
      if (e.index === 1) {
        localStorage.removeItem("search_list");
        render();
      }
    })
  })

  // 功能3: 删除一条记录的功能
  // (1) 点击删除按钮, 删除该条记录, 添加点击事件 (事件委托)
  // (2) 将 数组下标存储在 标签中, 将来用于删除
  // (3) 获取 下标, 根据下标删除数组的对应项  arr.splice( index, 1 );
  // (4) 将数组存储到本地历史记录中
  // (5) 重新渲染
  $(".lt_history").on("click", ".icon_delete", function () {
    var that = $(this);
    //确认框
    mui.confirm("你确定要删除这一条记录么？", "温馨提示", ["取消", "确定"], function (e) {
      //说明点击确认框
      if (e.index === 1) {
        //获取自定义属性index
        var index = $(that).data("index");
        //获取历史记录
        var arr = getHistory();
        //根据index进行删除
        arr.splice(index, 1);
        //存储到本地历史中
        localStorage.setItem("search_list", JSON.stringify(arr));
        //重新渲染
        render();
      }
    })
  })
  // 功能4: 添加搜索记录功能
  // (1) 给搜索按钮添加点击事件
  // (2) 获取搜索关键字
  // (3) 获取数组
  // (4) 添加到数组最前面
  // (5) 存储到本地历史记录中
  // (6) 重新渲染

  $(".search_btn").click(function () {
    //获取输入的信息
    var key = $(".search_input").val();
    if (key === "") {
      mui.toast("请输入输入搜索关键字");
      return;
    }

    //获取数组
    var arr = getHistory();
    // 需求:
    // 1. 不能有重复的项, 如果有, 将旧的删除
    // 2. 如果数组长度最多 10个
    var index = arr.indexOf(key);
    if(index > -1) {
      //找到该重复项删除
      arr.splice(index, 1);
    }
    if(arr.length >= 8) {
      //删除最后一项
      arr.pop();
    }

    //将输入的信息添加到数组最前面
    arr.unshift(key);
    //存储到本历史中
    localStorage.setItem("search_list", JSON.stringify(arr));
    //重新渲染
    render();

    //清空搜索框
    $(".search_input").val("");
    
    //进行页面跳转
    location.href = "searchList.html?key="+ key;

  })


})