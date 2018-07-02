

$(function () {
  // 点击登陆功能
  // 1. 绑定点击事件
  // 2. 获取输入框的值 (用户名和密码)
  // 3. 发送 ajax 请求, 进行登录
  //    如果传递过来了 url 地址, 根据 url 地址跳回去
  //    如果没传 url 地址, 默认跳转到会员中心

  $("#loginBtn").click(function () {
    console.log(111)
    var username = $("[name='username']").val();
    var password = $("[name='password']").val();

    if (username === "" || password === "") {
      mui.toast("用户名或密码不能为空");
      return;
    }
    $.ajax({
      url: "/user/login",
      type: "post",
      dataType: "json",
      data: {
        username: username,
        password: password
      },
      success: function (info) {
        console.log(info);
        if (info.error) {
          mui.toast("用户名或密码错误!")
        }
        if (info.success) {

          // 登录成功, 需要跳转
          // (1) 传地址了, 跳到地址页面
          // (2) 没传地址, 跳到会员中心
          // 只需要看 location.search 中有没有 retUrl
          if(location.search.indexOf("retUrl") === -1 ) {
            //说明没有
            location.href = "user.html";
          } else {
            //说明有
            var retUrl = location.search.replace("?retUrl=", "");
            location.href = retUrl; //跳转过去
          }
        }
      }
    })
  })


})