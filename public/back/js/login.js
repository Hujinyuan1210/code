/*
 * 1. 进行表单校验配置
 *    校验要求:
 *        (1) 用户名不能为空, 长度为2-6位
 *        (2) 密码不能为空, 长度为6-12位
 * */
$(function () {

  $("#form").bootstrapValidator({

    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', //成功
      invalid: 'glyphicon glyphicon-remove', //失败
      validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields: {

      username: {
          validators: {
            notEmpty: {
              message: "用户名不能为空"
            },
            stringLength: {
              min: 2,
              max: 6,
              message: "用户名必须在2~6位"
            },
            callback: {
              message: "用户名不存在"
            }
          }
      },

      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码必须在6~12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })

  //需要注册表单校验成功事件，在成功事件内，阻止默认提交，通过ajax提交
  $('#form').on('success.form.bv', function (e) {
      e.preventDefault(); //阻止默认的表单提交
    //通过ajax方式提交
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function (info) {

        console.log(info);

        if(info.success) {
          //验证通过
          location.href= "./index.html";
        }

        if( info.error === 1000 ) {
          //用户名不存在
          $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback") //动态的改变状态
        }
        if(info.error === 1001) {
          //密码错误
          $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback") //动态的改变状态
        }
      }
    })
  

  })

  //3.重置表单的bug，重置表单不仅要重置内容，还要重置校验状态
  $("[type='reset']").click(function (){
    $("#form").data('bootstrapValidator').resetForm(); //重置表单，并且会隐藏所有的错误提示和图标;
  })

});