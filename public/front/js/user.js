
$(function () {

  //请求ajax动态渲染用户

  $.ajax({
    url: "/user/queryUserMessage",
    type: "get",
    dataType: "json",
    success: function (info) {
      // console.log(info);
      var htmlStr = template("tmp", info);
      $(".mui-table-view").prepend(htmlStr);
    }
  })

  //点击退出按钮, 跳转到login页面
  $(".loginOut").click(function() {

    $.ajax({
      url: "/user/logout",
      type: "get",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if(info.success) {
          location.href = "./login.html";
        }
      }
    })

  })

})