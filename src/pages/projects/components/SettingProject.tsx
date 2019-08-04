import React from 'react';
import {Flex, Button } from 'antd-mobile';
import SettingProjectCommon from './SettingProjectCommon';
import { connect } from "react-redux";
import {setProjectAction,deleteProjectAction,restoreProjectAction} from "../../../redux/actions"

interface ISettingProject {
  project:IProject,
  setProjectAction:Function,
  deleteProjectAction:Function,
  restoreProjectAction:Function,
  onClick?:Function
}

class SettingProject extends React.Component<ISettingProject,any> {
  constructor(props:ISettingProject) {
    super(props)

    this.state={
      deadline:props.project.deadline,
      title:props.project.title,
      desc:props.project.desc
    }
  }

  saveProject=()=>{
    this.props.setProjectAction({
      ...this.props.project,
      ...this.state
    })

    if(this.props.onClick){
      this.props.onClick()
    }
  }

  deleteProject=()=>{
    
    if(this.props.onClick){
      this.props.onClick()
    }
    this.props.deleteProjectAction(this.props.project);
  }

  restoreProject=()=>{
    
    if(this.props.onClick){
      this.props.onClick();
    }
    this.props.restoreProjectAction(this.props.project);
  }

  onChange(key:string,value:any){
    const s:any = {}
    s[key] = value
    this.setState(s)
  }

  render(){
    let deleteOrRestoreElement:any;
    if(this.props.project.delete){
      deleteOrRestoreElement = <Button type="primary" onClick={this.restoreProject}>恢复项目</Button>
    }
    else{
      deleteOrRestoreElement = <Button type="warning" onClick={this.deleteProject}>删除项目</Button>
    }

    return (
      <div >
        <SettingProjectCommon
          title={this.state.title}
          desc={this.state.desc}
          deadline={this.state.deadline}
          onChange={(key:string,value:any)=>this.onChange(key,value)}
        >

        </SettingProjectCommon>

        <Flex>
          <Flex.Item>
            <Button type="primary" onClick={this.saveProject}>保存更新</Button>
          </Flex.Item>
          <Flex.Item>
            {deleteOrRestoreElement}
          </Flex.Item>
        </Flex>

      </div>
    );
  }
}

// export default SettingProject;

export default connect(
  null,
  { setProjectAction,deleteProjectAction,restoreProjectAction }
)(SettingProject);