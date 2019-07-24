import React from 'react';
import { Button } from 'antd-mobile';
import { addTaskAction,setGlobalTasksByProjectId } from "../redux/actions";
import { connect } from "react-redux";
import { taskType } from '../schema/Task';
import SettingTaskCommon from './SettingTaskCommon';

interface IAddingTaskProps{
  addTaskAction:Function,
  projectId:string,
  setGlobalTasksByProjectId:Function,
  onClick?:Function
}

class AddingTask extends React.Component<IAddingTaskProps,any>{
  constructor(props:any) {
    super(props)

    this.state={
      title:'',
      desc:'',
      taskType:taskType.middle,
      workload:4
    }
  }

  handleClick(){
    this.props.addTaskAction({
      ...this.state,
      projectId:this.props.projectId
    });
    this.props.setGlobalTasksByProjectId(this.props.projectId);
    if(this.props.onClick){
      this.props.onClick();
    }
  }

  onChange(key:string,value:any){
    const s:any = {}
    s[key] = value
    this.setState(s)
  }

  render(){
    return (
      <div>
        <SettingTaskCommon
          title={this.state.title}
          desc={this.state.desc}
          workload={this.state.workload}
          taskType={this.state.taskType}
          onChange={(key:string,value:any)=>this.onChange(key,value)}
        >

        </SettingTaskCommon>
        <Button type="primary" onClick={()=>this.handleClick()}>创建</Button>
      </div>
    )
  }
}


// export default AddingTask;

export default connect(
  null,
  { addTaskAction,setGlobalTasksByProjectId }
)(AddingTask);