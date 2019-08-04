import React from 'react';
import { connect } from "react-redux";

//@ts-ignore
import F2 from "@antv/f2/lib/index";
//@ts-ignore
import ScrollBar from "@antv/f2/lib/plugin/scroll-bar";

import moment from "moment";

// f2 interaction
require('@antv/f2/lib/interaction/pan');
require('@antv/f2/lib/interaction/pinch');

// TODO: force update props.
const mapStateToProps = (state:any) => {
  const {project,tasks,setups} = state.global;
  // console.log("ProjectState mapStateToProps")
  return {project,tasks:tasks.slice(),setups};
}


const sortByCompleteTime = (a:IItem,b:IItem)=>{
  //@ts-ignore
  return new Date(a.completeTime) - new Date(b.completeTime)
}

class ProjectState extends React.Component<any,any>{
  f2chart: any;
  constructor(props:any){
    super(props)
    this.state={
      // completeWorkload:0,
      // allWorkload:0
    }
  }
  componentDidUpdate =()=>{
    this.chart();
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
          date:moment(startTime).add(i,"days").format("YYYY-MM-DD"),
          value: (planCompleteWorkload=workTime*i)
        })
      }
      else{
        result.push({
          type:'计划',
          date:moment(startTime).add(i,"days").format("YYYY-MM-DD"),
          value: (planCompleteWorkload=allWorkload)
        })
      }
    }

    // add deadline
    if( this.props.project.deadline && 
        result.length &&
        moment(result[result.length-1].date).isBefore(this.props.project.deadline) 
      ){
      result.push({
        type:"计划",
        date:moment(this.props.project.deadline).format("YYYY-MM-DD"),
        value:allWorkload
      })
    }

    // this.setState({allWorkload:allWorkload})
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
        date:moment(t.completeTime).format("YYYY-MM-DD"),
        value:completeWorkload
      })
    });
    // this.setState({completeWorkload:completeWorkload})
    return result;
  }

  chart(){
    if(!this.props.project){
      return;
    }

    if(this.f2chart){
      this.f2chart.destroy()
    }

    let plan = this.getPlanData();
    let actual = this.getActualData();
    let data = plan.concat(actual);
    let dateValues:any[] = []
    const deadline = this.props.project.deadline;

    if(data.length === 0){
      return;
    }

    let todayIndex:number = 0;
    const today = moment().format("YYYY-MM-DD");
    plan.forEach((v:any,index:number)=>{
      dateValues.push(v.date)
      if(v.date === today){
        todayIndex = index;
      }
    })
    // start from today
    if(todayIndex){
      dateValues.splice(0,todayIndex)
    }



    let chart = new F2.Chart({
      id: 'mountNode',
      pixelRatio: window.devicePixelRatio,
      plugins: ScrollBar
    });

    this.f2chart = chart;
    let len = dateValues.length
    this.f2chart.source(data,{
      date: {
        type:'timeCat',
        mask: 'M.D',
        tickCount: 5,
        values:len>0 ? dateValues.slice(0,len>5?5:undefined) : [],
        sortable: false
      }
    });



    chart.axis('date',{
      line:{
        fill:'#fff',
      },
      grid:{
        fill:'#fff',
      },
      label:{
        fill:'#fff',
      }
    })

    chart.axis('value',{
      line:{
        fill:'#fff',
      },
      grid:{
        fill:'#fff',
      },
      label:{
        fill:'#fff',
      }
    })

    chart.interaction('pan');
    chart.interaction('pinch');
    chart.scrollBar({
      mode: 'x',
      xStyle: {
        offsetY: -1
      }
    });
    chart.legend({
      align:'center'
    });

    if(deadline){
      chart.guide().text({
        position:[moment(deadline).format('YYYY-MM-DD'),'max'],
        content:'截止日期',
        style:{
          fill:'#fff',
          fontWeight: 'bold'
        }
      })
      chart.guide().line({
        start:[moment(deadline).format('YYYY-MM-DD'),0],
        end:[moment(deadline).format('YYYY-MM-DD'),'max'],
        style:{
          stroke:'#f00',
          lineDash: [ 0, 2, 2 ]
        }
      })

    }


    chart.area().position('date*value').color('type');
    chart.line().position('date*value').color('type').size(1);
    chart.point().position('date*value').color('type');
    chart.render();
  }

  render(){
    return (
      <div>
        <canvas id="mountNode" className="full" style={{marginTop:'0.5rem'}}></canvas>
      </div>
    )
  }
}
// export default ProjectState;

export default connect(
  mapStateToProps
)(ProjectState);