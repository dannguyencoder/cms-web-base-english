import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ConversionCharts extends React.Component {
  getOption = () => {
    const {
      collection,
      success
    } = this.props

    return {
      title : {
        text: 'Customer collection conversion rate',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Favorite shopping cart','Order completed']
      },
      series : [
        {
        name: 'Statistics',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value: collection, name:'Favorite shopping cart'},
          {value: success, name:'Order completed'},
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
