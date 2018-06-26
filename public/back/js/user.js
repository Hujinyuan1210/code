
//使用ajax请求后台,返回数据,使用模板引擎渲染数据

$(function () {

  var currentPage = 1; //当前页
  var pageSize = 5; //每页多少条

  // 声明变量, 标记当前选中的用户
  var currentId;
  var isDelete;

  //一进页面就渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $("tbody").html(htmlStr);
      

        //分页初始化
        $('#page').bootstrapPaginator({
          //版本声明必须
          bootstrapMajorVersion: 3,
          //当前第几页
          currentPage: info.page,
          //总共多少页
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            console.log(page); //获取当前点击的页数
            currentPage = page;
            render();
          }

        })

      }

    })

  }

  // 2. 启用禁用功能, 点击按钮, 弹出模态框(复用, 用的是同一个模态框)
  //    通过事件委托来注册点击事件, 效率更高
  $("tbody").on('click', '.btn', function () {
    $('#userModal').modal("show");
    currentId = $(this).parent().attr("data-id");
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    // console.log(currentId);
    // console.log(isDelete);
  })

  $('#submitBtn').click(function () {
    $.ajax({
      url: "/user/updateUser",
      type: "post",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      success: function (info) {
        // console.log(info);
        if(info.success) {
          // 关闭模态框
          $("#userModal").modal("hide");
          //重新渲染页面
          render();
        }
      }
    })
    
  })


})