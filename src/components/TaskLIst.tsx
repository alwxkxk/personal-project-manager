import React from 'react';
import Task from "./Task";
import { connect } from "react-redux";
import { taskType } from '../schema/Task';


const mapStateToProps = (state:any) => {
  const {tasks} = state.global;
  // force update
  return {
    tasks:[...tasks]
  };
}

const sortByUpdateTime = (a:ITask,b:ITask)=>{
  //@ts-ignore
  return new Date(b.updateTime) - new Date(a.updateTime)
}

const generateElement= (ts:ITask[],navText:string)=>{
  if(ts.length > 0){
    return (
      <div>
        <div className="tasks-nav emerge">{navText}:{ts.length}</div>
        {
          ts.map((t:ITask,index:number)=>{
          return <Task 
            key={t.uuid} 
            task={t}
            style={{animationDelay:`${index}00ms`}}
            > </Task>
          })
        }
      </div>
    )
  }

}

class TaskList extends React.Component<any,any>{
  render(){
    const tasks = this.props.tasks.sort(sortByUpdateTime)

    if(tasks.length === 0){
      return(
        <div>暂无任务，请添加。</div>
      )
    }
    else{
      const priorTasks:ITask[] = [];
      const middleTasks:ITask[] = [];
      const lastTasks:ITask[] = [];
      const completeTasks:ITask[] = [];
      const deleteTasks:ITask[] = [];
      tasks.forEach((t:ITask) => {
        if(t.delete){
          deleteTasks.push(t);
        }
        else if(t.complete){
          completeTasks.push(t);
        }
        else if(t.taskType === taskType.prior){
          priorTasks.push(t);
        }
        else if(t.taskType === taskType.middle){
          middleTasks.push(t);
        }
        else if(t.taskType === taskType.last){
          lastTasks.push(t);
        }
      });

      return (
        <div>
          {generateElement(priorTasks,'前期任务')}
          {generateElement(middleTasks,'中期任务')}
          {generateElement(lastTasks,'后期任务')}
          {this.props.hideComplete || generateElement(completeTasks,'已完成')}
          {this.props.hideDelete || generateElement(deleteTasks,'回收箱')}
        </div>
      )
    }

  }
}


// export default TaskList;
export default connect(
  mapStateToProps
)(TaskList);
