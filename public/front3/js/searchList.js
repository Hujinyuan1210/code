/**
 * Created by Jepson on 2018/6/29.
 */

$(function() {

  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var key = getSearch("key");
  $('.search_input').val( key );
  render();


  // 功能, 获取搜索框的值, 发送ajax请求, 进行页面渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: {
        proName: $('.search_input').val(),
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template( "productTpl", info );
        $('.lt_product').html( htmlStr );
      }
    })
  }



  // 2. 点击搜索按钮, 进行搜索功能
  $('.search_btn').click(function() {
    // 搜索成功, 需要更新历史记录
    var key = $('.search_input').val();
    if ( key === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }

    // 调用 render 方法, 重新根据搜索框的值进行页面渲染
    render();

    // 获取数组
    var history = localStorage.getItem("search_list");
    var arr = JSON.parse( history );

    // 1. 不能重复
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      arr.splice( index, 1 );
    }
    // 2. 不能超过 10 个
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    // 添加到数组最前面
    arr.unshift( key );
    // 存到 localStorage 里面去
    localStorage.setItem( "search_list", JSON.stringify( arr ) );

    // 清空搜索框
    $('.search_input').val("");
  });



})
