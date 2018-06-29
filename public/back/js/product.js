$(function () {

  //请求ajax获取数据 渲染页面
  var currentPage = 1; //当前页
  var pageSize = 5; //一页多少条
  //定义一个数组，专门用于存储所有上传的图片地址
  var picArr = [];

  //一进页面渲染数据
  render();

  function render() {
    $.ajax({
      url: "/product/queryProductDetailList",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $("tbody").html(htmlStr);

        //初始化分页
        $("#page").bootstrapPaginator({
          bootstrapMajorVersion: 3, //设置版本号
          totalPages: Math.ceil(info.total / info.size), //共多少页
          currentPage: info.page, //当前页
          // 配置每个按钮的显示文字
          // 每个按钮, 在初始化时都会调用这个方法, 根据返回值进行设置文本
          // type: 决定了按钮的功能类型, page, 就是普通页面, next, prev, last, first
          // page: 点击该按钮, 跳转到哪一页
          // current: 表示当前是第几页
          itemTexts: function (type, page, current) {
            // console.log(page)
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page
            }
          },
          // 配置每个按钮的 title
          // 每个按钮都会调用这个方法, 将方法的返回值, 作为 title 的内容
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页😀";
            }

          },
          //使用 bootstrap 的提示框
          useBootstrapTooltip: true,
          //控件的大小
          size: "mini",


          //为每个分页添加点击事件
          onPageClicked: function (a, b, c, page) {
            //将点击当前页赋值给currentPage,并重新渲染
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  //点击添加商品按钮显示模态框
  $("#add").click(function () {
    $("#productModal").modal("show");
    //使用ajax渲染二级下拉框
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      type: "get",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tpl", info);
        $("#option").html(htmlStr);

      }
    })
  })

  //使用事件委托， 给每个a添加事件
  $("#option").on("click", "a", function () {
    //将点击的文本赋值给dorpdownTxt
    $("#dorpdownTxt").html($(this).text());
    //将 brandId 设置到隐藏域中
    $('[name="bandId"]').val($(this).data('id'));
    //手动设置隐藏域的校验效果
    $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");

  })

  // 4. 进行图片上传初始化
  // 文件上传说明
  // 上传三张图片, 将来服务器端一旦存好一张, 就会响应一张
  // 将来每次响应一次, 就会调用一次 done 方法, 这样用户体验是最好的
  // jquery-fileupload 对文件的上传提交进行了封装, 每次选择完图片后, 就会向接口发送请求上传图片
  $("#fileupload").fileupload({
    //配置返回的数据类型
    dataType: "json",
    //配置图片上传后的回调函数
    done: function (e, data) {
      // console.log(data.result)
      var picUrl = data.result.picAddr;
      // 每次上传成功, 将图片地址和图片名称的对象, 推到 picArr 数组的最前面, 和图片结构同步
      picArr.unshift(data.result);
      // console.log(picArr);
      //根据图片地址进行图片预览
      $("#imgBox").prepend('<img src=" ' + picUrl + ' "width="100" height="100 ">');

      if (picArr.length > 3) {
        picArr.pop(); //删除数组最后一个的数据
        // img:last-of-type 找到最后一个 img 类型的标签, 让他自杀
        $("#imgBox img:last-of-type").remove(); //图片结构也要删除最后一张图片、
      }

      if(picArr.length === 3) {
        $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
      } 
    }
  })

  //5. 通过表单校验插件, 实现表单校验
  $("#form").bootstrapValidator({
    // 需要对隐藏域进行校验, 所以配置一下
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    //配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      // 要求: 商品库存要求是 必须是非零开头的数字
      // 1 11 121
      /*
      * [1-9]  可以出现 1-9 中的任意一个
      * [^0]   除了0都可以出现, 包括字母
      *
      * \d     数字 [0-9]
      *  + 可以出现 一次 或 多次
      *  * 可以出现 0次 或 的多次
      *  ? 可以出现 0次 或 1次
      *  {n} 可以先 n 次
      * */
     num: {
       validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        regexp: {
          //正则校验
          regexp: /^[1-9]\d*$/,
          message: "商品库存必须是非零开头的数字"
        }
       }
     },
     //尺码校验需求： 必须是xx-xx的格式，xx表示数字
     size: {
      validators: {
        notEmpty: {
          message: "请输入商品的尺码"
        },
       regexp: {
         //正则校验
         regexp: /^\d{2}-\d{2}$/,
         message: "商品尺码必须是xx-xx的格式，例如 32-40"
       }
      }
     },
     oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
     },
     price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
     },
     picStatus: {
       validators: {
         notEmpty: {
           message: "请上传 3 张图片"
         }
       }
     }
    }
  })
  
  //6.注册表单校验成功事件，阻止默认的提交， 通过ajax提交
  $("#form").on("success.form.bv", function (e) {

     e.preventDefault();

    //  console.log($("#form").serialize());
    var parameterStr = $("#form").serialize(); //获取表单序列化（数据）
    //还需要拼接上照片的地址和名称
    parameterStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    parameterStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    parameterStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: parameterStr,
      dataType: "json",
      success: function( info ) {
        console.log(info);
        if(info.success) {
          //隐藏模态框
          $("#productModal").modal("hide");
          //重置表单内容
          $("#form").data("bootstrapValidator").resetForm(true);
          //重新渲染第一页
          currentPage = 1;
          render();
          //手动设置重置文本
          $("#dorpdownTxt").text("请选择二级分类");
          //手动重置图片，找到所有的图片，让所有图片自杀
          $("#imgBox img").remove();  
        }
        
      }
    })
  })

})