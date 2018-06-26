    // 基于准备好的dom，初始化echarts实例
    var echarts_1 = echarts.init(document.querySelector('.echarts_1'));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '2018年注册人数'
      },
      tooltip: {},
      legend: {
        data: ['人数']
      },
      xAxis: {
        data: ["一月", "二月", "三月", "四月", "五月", "六月"]
      },
      yAxis: {},
      series: [{
        name: '人数',
        type: 'bar',
        data: [1000, 1500, 2000, 1800, 3200, 4020]
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_1.setOption(option);



    // 基于准备好的dom，初始化echarts实例
    var echarts_2 = echarts.init(document.querySelector('.echarts_2'));

    option = {
      title: {
        text: '热门品牌销售',
        subtext: '2018年6月',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['李宁', '阿迪', '新百伦', '乔丹', '耐克']
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: '65%',
        center: ['50%', '60%'],
        data: [{
            value: 335,
            name: '李宁'
          },
          {
            value: 310,
            name: '阿迪'
          },
          {
            value: 234,
            name: '新百伦'
          },
          {
            value: 135,
            name: '乔丹'
          },
          {
            value: 1548,
            name: '耐克'
          }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_2.setOption(option);