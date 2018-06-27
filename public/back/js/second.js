//使用ajax请求服务器 获取数据 模板引擎渲染数据
$(function () {

  var currentPage = 1; //当前页
  var pageSize = 5; //每页多少条

  //一进页面就渲染页面  
  render();

  //渲染方法
  function render() {
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $('tbody').html(htmlStr);

        //添加分页
        $("#page").bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号
          totalPages: Math.ceil(info.total / info.size), //共多少页
          currentPage: info.page, //当前页
          //为点击分页添加事件
          onPageClicked: function (a, b, c, page) {
            // console.log(page);
            //page是当前被点击的,赋值给currentPage,重新渲染页面
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  //2.点击添加分类
  $('#add').click(function () {
   //显示模态框
    $("#secondModal").modal("show");

      //发送 ajax 请求 获取下拉菜单的数据,进行渲染下拉菜单
      $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        // 通过加载第一页,100条数据,模拟获取所有一级分类的数据
        data: {
          page: 1,
          pageSize: 100
        },
        dataType: "json",
        success: function (info) {
          // console.log(info);
          $('#option').html( template("tpl", info));
        }

      })
  })

  //3.给option 注册委托事件,让a 可以被点击
  $("#option").on("click", "a", function () {
    // 获取当前被点击的文本
    var text = $(this).text();
    //赋值给 dorpdownTxt 中
    $("#dorpdownTxt").text( text);

     //将id存在name="categoryName" 的input 中
     $('[name="categoryId"]').val( $(this).data("id") );

     //用户选择了一级分类后， 需要将 name="categoryId" input框的校验状态设置成VAlId
     //参数1：字段名 参数2：设置成什么状态 参数3：回调函数（配置提升信息）
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })

  //4.进行 jquery-fileupload 实例化
  $("#fileupload").fileupload({
    //返回的数据类型格式
    dataType: "json",
    //e: 事件对象
    //data: 图片上传后的对象,通过data.result.picAddr可以获取上传后的图片地址
    //图片上传完成后的回调函数
    done: function (e, data) {
      var url = data.result.picAddr; //上传后得到图片的地址
      $("#pic").attr("src", url); //设置图片地址给图片
      //将图片地址存在name="brandLogo" 的input 中
      $('[name="brandLogo"]').val(url);
      //手动将表单校验状态重置成 VALID
      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  })
  
  //5：通过表单校验插件实现表单校验功能
  $("#form").bootstrapValidator({

     //categoryId 用户选择一级分类 id
      //brandName  用户输入二级分类名称
      //brandLogo  上传的图片地址

    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    //   默认不校验 隐藏域的 input, 我们需要重置 excluded 为 [], 恢复对 隐藏域的校验
    excluded: [],


    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', //成功
      invalid: 'glyphicon glyphicon-remove', //失败
      validating: 'glyphicon glyphicon-refresh' //校验中
    },
    //配置字段
    fields: {

      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级类名"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请选择二级类名"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }

  })

  //6.注册表单校验成功事件，阻止默认提交，通过ajax提交
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();
    //通过ajax提交
    $.ajax({
      url: "/category/addSecondCategory",
      type: "post",
      data: $("#form").serialize(),
      dataType: "json",
      success: function( info ) {
        // console.log(info);
        if(info.success) {
          //隐藏模态框
          $("#secondModal").modal("hide");
          //重置表单
          $("#form").data('bootstrapValidator').resetForm(true); //重置表单，并且会隐藏所有的错误提示和图标;
          //添加新数据后 渲染第一页最合适
          currentPage = 1;
          //重新渲染数据
          render();
          // 由于下拉框和图片不是表单，所以需要手动设置重置
          $("#dorpdownTxt").text("请选择一级分类");
          $("#pic").attr('src', "./images/none.png");

        }
      }
    })
  })
  
  
});