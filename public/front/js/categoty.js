
$(function () {

  $.ajax({
    url: "/category/queryTopCategory",
    type: "get",
    dataType: "json",
    success: function (info) {
      // console.log( info );  
      var htmlStr = template("tmp", info );
      $(".lt_aside ul").html(htmlStr);

      //应该渲染 返回一级分类中 第一个分类的 对应二级分类进行渲染
      renderSecondId(info.rows[0].id);
    }
  })
  // 2. 点击左侧按钮, 获取当前点击的 一级分类id, 让二级列表重新渲染
  //    用事件委托给 a 注册点击事件
  $(".lt_aside ul").on("click", "a", function () {
    var id = $(this).data("id");
    renderSecondId(id);
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
  })

  //发送ajax请求
  function renderSecondId(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success:function (info) {
        // console.log(info);
        var htmlStr = template("tpl", info);
        $(".lt_category_right ul").html(htmlStr);
      }
    })
  }


})