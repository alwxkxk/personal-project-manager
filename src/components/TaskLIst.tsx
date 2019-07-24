import React from 'react';
import ItemCard from "./ItemCard";
import { connect } from "react-redux";
import {setTask} from "../redux/actions";
import { Modal } from 'antd-mobile';
import SettingTask from './SettingTask';
import moment from "moment";


const mapStateToProps = (state:any) => {
  const {tasks} = state.global;
  return {tasks};
}

class TaskList extends React.Component<any,any>{
  constructor(props:any){
    super(props)
    this.state={
      modal:false,
      task:{}
    }
  }

  handleTitleClick(task:ITask){
    this.setState({modal:true,task:task})
  }

  handleOnSwitch(task:ITask){
    return (checked:boolean)=>{
      const t = {
        ...task,
        complete:checked,
        completeTime:checked?moment().format():''
      }
      this.props.setTask(t)
    }
  }

  render(){
    return (
      <div>
        {this.props.tasks.map((t:ITask)=>{
          return <ItemCard 
            key={t.uuid} 
            complete={t.complete} 
            desc={t.desc} 
            title={t.title}
            onSwitch={this.handleOnSwitch(t)}
            onTitleClick={()=>this.handleTitleClick(t)}
            > </ItemCard>
        })}

        <Modal
          visible={this.state.modal}
          transparent
          // maskClosable={false}
          onClose={()=>this.setState({modal:false})}
          title="任务设置"
          closable={true}
        >
          <div style={{ overflow: 'scroll' }}>
            <SettingTask task={this.state.task} onClick={()=>this.setState({modal:false})}></SettingTask>
          </div>
        </Modal>
      </div>
    )
  }
}


// export default TaskList;
export default connect(
  mapStateToProps,
  {setTask}
)(TaskList);
