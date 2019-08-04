import React from 'react';
import SettingTaskCommon from './SettingTaskCommon';
import { Button, Flex, DatePicker, List } from 'antd-mobile';
import { connect } from "react-redux";
import {setTask,deleteTaskAction,restoreTaskAction} from "../redux/actions";
import moment from 'moment';

interface ISettingTaskProps{
  deleteTaskAction:Function,
  task:ITask,
  restoreTaskAction:Function,
  setTask:Function,
  onClick?:Function // for closeModal
}

class SettingTask extends React.Component<ISettingTaskProps,any>{
  constructor(props:ISettingTaskProps) {
    super(props)
    // copy data to state
    this.state={
      ...this.props.task
    }
  }

  onChange(key:string,value:any){
    const s:any = {}
    s[key] = value
    this.setState(s)
  }
  saveTask(){
    this.props.setTask({
      ...this.state
    })
    if(this.props.onClick){
      this.props.onClick()
    }
  }

  deleteTask=()=>{
    if(this.props.onClick){
      this.props.onClick()
    }
    this.props.deleteTaskAction(this.props.task)
  }

  restoreTask=()=>{
    if(this.props.onClick){
      this.props.onClick()
    }
    this.props.restoreTaskAction(this.props.task)
  }



  render(){
    let deleteOrRestoreElement:any;
    if(this.props.task.delete){
      deleteOrRestoreElement = <Button type="primary" onClick={this.restoreTask}>恢复任务</Button>
    }
    else{
      deleteOrRestoreElement = <Button type="warning" onClick={this.deleteTask}>删除任务</Button>
    }

    return (
      <div>
        <SettingTaskCommon
          title={this.state.title}
          desc={this.state.desc}
          workload={this.state.workload}
          taskType={this.state.taskType}
          onChange={(key:string,value:any)=>this.onChange(key,value)}
        >

        ></SettingTaskCommon>

        {
          this.props.task.complete && (
            <List>
              <DatePicker
                mode="date"
                value={new Date(this.state.completeTime)}
                onChange={(date)=>this.setState({completeTime:moment(date).format()})}
              >
                 <List.Item arrow="horizontal">完成时间</List.Item>
              </DatePicker>
            </List>
          )
        }


        <Flex>
          <Flex.Item>
            <Button type="primary" onClick={()=>this.saveTask()}>保存更新</Button>
          </Flex.Item>
          <Flex.Item>
            {deleteOrRestoreElement}
          </Flex.Item>
        </Flex>

      </div>
    )
  }
}

// export default SettingTask;

export default connect(
  null,
  { setTask,deleteTaskAction,restoreTaskAction }
)(SettingTask);