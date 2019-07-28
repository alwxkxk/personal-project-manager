import React from 'react';
import SettingTaskCommon from './SettingTaskCommon';
import { Button, Flex, DatePicker, List } from 'antd-mobile';
import { connect } from "react-redux";
import {deleteTaskAction,setGlobalTasksByProjectId,setTask} from "../redux/actions";
import moment from 'moment';

interface ISettingTaskProps{
  task:ITask,
  deleteTaskAction:Function,
  setGlobalTasksByProjectId:Function,
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

  deleteTask(){
    this.props.deleteTaskAction(this.props.task)
    this.props.setGlobalTasksByProjectId(this.props.task.projectId)
    if(this.props.onClick){
      this.props.onClick()
    }
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
          <Button type="warning" onClick={()=>this.deleteTask()}>删除任务</Button>
          </Flex.Item>
        </Flex>

      </div>
    )
  }
}

// export default SettingTask;

export default connect(
  null,
  { deleteTaskAction,setGlobalTasksByProjectId,setTask }
)(SettingTask);