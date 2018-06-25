


$(function() {
  
  //一进页面就开始判断用户是否登录
  //先判断当页面是不是登录页面，如果不是在进行判断
  if(location.href.valueOf('login.html') === -1) {
    //判断用户是否登录

    $.ajax({
      url: "/employee/checkRootLogin",
      type: "get",
      data: "json",
      success: function (info) {
        console.log(info)

        if (info.error === 400) {
          //未登录
          location.href = "./login.index";
        }

      }
    })
  }

  //实现进度条功能（给ajax请求加），注意需要给所有的ajax都加
  //发送ajax开启进度条，ajax结束，关闭进度条

  //第一个ajax发送时，开启进度条
  $(document).ajaxStart(function () {
    NProgress.start();
  })

  $(document).ajaxStop(function () {
    NProgress.done();
  })

})