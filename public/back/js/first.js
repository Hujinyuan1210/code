
$(function () {
  //1.请求使用ajax后台获取数据
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("tmp", info);
        $('tbody').html(htmlStr);

        //分页器初始化
        $("#page").bootstrapPaginator({
          bootstrapMajorVersion: 3, //需要定义版本号
          //总共多少页
          totalPages: Math.ceil(info.total / info.size),
          //当前第几页
          currentPage: info.page,
          //点击分页
          onPageClicked: function (a, b, c, page) {
            //更新当前页
            currentPage = page;
            //重新渲染
            render();
          }

        })

      }
    })
  }

  //2.点击添加按钮 显示模态框
  $("#add").click(function() {
    //显示模态框
    $("#firstModal").modal("show"); 
  })
  //3.校验表单
  $("#form").bootstrapValidator({
    //配置图标
      feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //配置字段
    fields: {
      categoryName: {
        //配置校验规则
        validators: {
          //非空校验
          notEmpty: {
            message: "不能为空哦!"
          }
        }

      }
    }

  })


  //4.注册表单校验成功事件,阻止默认成功的提交,通过ajax进行提交
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();

    //通过ajax提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data:$("form").serialize(),
      dataType: "json",
      success: function ( info ) {
        console.log(info);
        if(info.success) {
          //隐藏模态框
          $("#firstModal").modal("hide");
           //重新渲染页面, 渲染第一页最合适
          currentPage = 1;
          //重新渲染页面
          render();
          //重置模态框的表单, 传 true 不仅重置校验状态, 还重置表单内容
          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })

})