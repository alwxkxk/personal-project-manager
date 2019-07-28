import React from 'react';
import Task from "./Task";
import { connect } from "react-redux";


const mapStateToProps = (state:any) => {
  const {tasks} = state.global;
  return {tasks};
}

class TaskList extends React.Component<any,any>{
  render(){
    const tasks = this.props.tasks
    if(tasks.length === 0){
      return(
        <div>暂无任务，请添加。</div>
      )
    }
    else{
      return (
        <div>
          {tasks.map((t:ITask)=>{
            return <Task 
              key={t.uuid} 
              task={t}
              > </Task>
          })}
        </div>
      )
    }

  }
}


// export default TaskList;
export default connect(
  mapStateToProps
)(TaskList);
