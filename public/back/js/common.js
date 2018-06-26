


$(function() {
  
  //一进页面就开始判断用户是否登录
  //先判断当页面是不是登录页面，如果不是在进行判断
  if(location.href.indexOf('login.html') === -1) {
    //判断用户是否登录

    $.ajax({
      url: "/employee/checkRootLogin",
      type: "get",
      data: "json",
      success: function (info) {
        // console.log(info)

        if (info.error == 400) {
          //未登录
          location.href = "./login.html";
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

});

//公共功能
$(function() {
  //1.左侧二级菜单切换显示
  $('.lt_aside .category').click(function () {
    $('.lt_aside .child').stop().slideToggle();
  })

  //2. 左侧整个侧边栏显示隐藏功能
  $('.topbar .icon_menu').click(function () {
    console.log(1111)
    $('.lt_aside').toggleClass('hidemenu');
    $('.topbar').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
  })

  //3. 点击头部退出按钮, 显示退出模态框
  $(".icon_logout").click(function () {
    //显示模态框
    $("#logoutModal").modal('show');
  });
  //4.点击模态框中的退出按钮，需要进行退出操作（ajax）
  $('#logoutBtn').click(function () {
    // 发送ajax请求进行退出操作, 让后台销毁当前用户的登陆状态
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      success: function (info) {
        // console.log(info);
        if(info.success) {
          //跳转到登录页面
          location.href="login.html";
        }
      }
    })
  })
    
})