import React from 'react';
import { connect } from "react-redux";
//@ts-ignore
import F2 from "@antv/f2/lib/index";
//@ts-ignore
import ScrollBar from "@antv/f2/lib/plugin/scroll-bar";
import moment from "moment";
import { WingBlank } from 'antd-mobile';
// 引入 interval-select
require('@antv/f2/lib/interaction/interval-select');

// 引入 pan
require('@antv/f2/lib/interaction/pan');
// interface IProjectStateProps{
//   project:IProject
// }

const mapStateToProps = (state:any) => {
  const {project,tasks,setups} = state.global;
  return {project,tasks,setups};
}


const sortByCompleteTime = (a:IItem,b:IItem)=>{
  //@ts-ignore
  return new Date(a.completeTime) - new Date(b.completeTime)
}

class ProjectState extends React.Component<any,any>{
  constructor(props:any){
    super(props)
    this.state={
      completeWorkload:0,
      allWorkload:0
    }
  }
  componentDidMount(){
    this.chart();
  }

  getPlanData():any[]{
    let result:any[] = []
    const tasks = this.props.tasks
    const startTime = this.props.project.createTime;
    const workTime = this.props.setups.workTime;
    let allWorkload =0;
    tasks.forEach((t:ITask)=>{
      allWorkload += t.workload;
    })

    let planCompleteWorkload = 0;
    for(let i = 0;planCompleteWorkload<allWorkload;i++){
      if(allWorkload - planCompleteWorkload >workTime){
        result.push({
          type:'计划',
          date:moment(startTime).add(i,"days").format("M.D"),
          value: (planCompleteWorkload=workTime*i)
        })
      }
      else{
        result.push({
          type:'计划',
          date:moment(startTime).add(i,"days").format("M.D"),
          value: (planCompleteWorkload=allWorkload)
        })
      }
    }
    this.setState({allWorkload:allWorkload})
    return result;
  }

  getActualData():any[]{
    let result:any[] = []
    let completeTasks = this.props.tasks.filter((t:ITask)=>t.complete).sort(sortByCompleteTime)
    let completeWorkload = 0;
    completeTasks.forEach((t:ITask) => {
      completeWorkload += t.workload;
      result.push({
        type:'完成',
        date:moment(t.completeTime).format("M.D"),
        value:completeWorkload
      })
    });
    this.setState({completeWorkload:completeWorkload})
    return result;
  }

  chart(){
    if(!this.props.project){
      return;
    }

    let plan = this.getPlanData();
    let actual = this.getActualData();
    let data = plan.concat(actual)

    console.log(data);
    var chart = new F2.Chart({
      id: 'mountNode',
      pixelRatio: window.devicePixelRatio,
      plugins: ScrollBar
    });
    chart.source(data, {
      // date: {
      //   range: [0, 1]
      // }
    });
    // chart.tooltip({
    //   showCrosshairs: true,
    //   custom: true,
    //   onChange: function onChange(obj:any) {
    //     var legend = chart.get('legendController').legends.top[0];
    //     var tooltipItems = obj.items;
    //     var legendItems = legend.items;
    //     var map:any = {};
    //     legendItems.map(function(item:any) {
    //       map[item.name] = {...item}
    //     });
    //     tooltipItems.map(function(item:any) {
    //       var name = item.name;
    //       var value = item.value;
    //       if (map[name]) {
    //         map[name].value = value;
    //       }
    //     });
    //     legend.setItems(Object.values(map));
    //   },
    //   onHide: function onHide() {
    //     var legend = chart.get('legendController').legends.top[0];
    //     legend.setItems(chart.getLegendItems().type);
    //   }
    // });

    // debugger;
    // console.log(interaction)
    chart.interaction('pan');
    // 定义进度条
    chart.scrollBar({
      mode: 'x',
      xStyle: {
        offsetY: -5
      }
    });
    chart.area().position('date*value').color('type');
    chart.line().position('date*value').color('type').size(2);
    chart.point().position('date*value').color('type');
    chart.render();
  }

  render(){
    // const project = this.props.project || {};
    return (
      <div>
        <canvas id="mountNode" style={{backgroundColor:"#fff",marginTop:'0.5rem'}}></canvas>
        <WingBlank className="text-left" >
          <div>
            进度：工作量 {`${this.state.completeWorkload}/${this.state.allWorkload}`} ，进度正常。
          </div>
        </WingBlank>

      </div>
    )
  }
}
// export default ProjectState;

export default connect(
  mapStateToProps
)(ProjectState);