import React from 'react';
import { connect } from "react-redux";
//@ts-ignore
import F2 from "@antv/f2";

// interface IProjectStateProps{
//   project:IProject
// }

const mapStateToProps = (state:any) => {
  const {project,tasks} = state.global;
  return {project,tasks};
}


const sortByCompleteTime = (a:IItem,b:IItem)=>{
  //@ts-ignore
  return new Date(a.completeTime) - new Date(b.completeTime)
}

class ProjectState extends React.Component<any,any>{
  constructor(props:any){
    super(props)
    this.state={

    }
  }
  componentDidMount(){
    this.chart();
  }

  chart(){
    let allWorkload =0;
    let completeWorkload = 0;
    const data:any = [];
    let completeTasks = this.props.tasks.filter((t:ITask)=>t.complete).sort(sortByCompleteTime)
    this.props.tasks.forEach((t:ITask)=>{
      allWorkload += t.workload;
    })

    completeTasks.forEach((t:ITask) => {
      completeWorkload += t.workload;
      data.push({
        type:'完成',
        date:t.completeTime,
        value:completeWorkload
      })
    });

    console.log(completeTasks,data);
    var chart = new F2.Chart({
      id: 'mountNode',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
      date: {
        range: [0, 1]
      }
    });
    chart.tooltip({
      showCrosshairs: true,
      custom: true,
      onChange: function onChange(obj:any) {
        var legend = chart.get('legendController').legends.top[0];
        var tooltipItems = obj.items;
        // var legendItems = legend.items;
        var map:any = {};
        // legendItems.map(function(item:any) {
        //   map[item.name] = _.clone(item);
        // });
        tooltipItems.map(function(item:any) {
          var name = item.name;
          var value = item.value;
          if (map[name]) {
            map[name].value = value;
          }
        });
        // legend.setItems(_.values(map));
      },
      onHide: function onHide() {
        // var legend = chart.get('legendController').legends.top[0];
        // legend.setItems(chart.getLegendItems().type);
      }
    });
    chart.area().position('date*value').color('type').adjust('stack');
    chart.line().position('date*value').color('type').size(2).adjust('stack');
    chart.point().position('date*value').color('type').adjust('stack');
    chart.render();
  }

  render(){
    const project = this.props.project || {};
    return (
      <div>
        <canvas id="mountNode"></canvas>
        <div>项目名：{project.title}</div>
        <div>描述：{project.desc}</div>
        {/* <div>截止日期：{project.deadline || '无'}</div> */}
      </div>
    )
  }
}
// export default ProjectState;

export default connect(
  mapStateToProps
)(ProjectState);