import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class OrderCharts extends React.Component {
  getOption = () => {
    const {
      wait,
      success,
      refunding,
      dispatching
    } = this.props

    return {
      title : {
        text: 'Order status summary',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['to be delivered', 'Successful transaction', 'Refunding', 'In distribution']
      },
      series : [
        {
        name: 'Statistics',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value: wait, name:'to be delivered'},
          {value: success, name:'Successful transaction'},
          {value: refunding, name:'Refunding'},
          {value: dispatching, name:'In distribution'},
        ],
        itemStyle: {
          emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
        }
      ]
    }
  }

  render() {

    return (
      <ReactEcharts
        option={this.getOption()}
        style={{
          height: 300,
          backgroundColor: '#fff',
          padding: '24px'
        }}
      />
    )
  }
}
