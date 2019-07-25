import React from 'react';
import {Flex, Button } from 'antd-mobile';
import SettingProjectCommon from './SettingProjectCommon';
import { connect } from "react-redux";
import {setProjectAction,deleteProjectAction} from "../../../redux/actions"

interface ISettingProject {
  project:IProject,
  setProjectAction:Function,
  deleteProjectAction:Function,
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

  saveProject(){
    this.props.setProjectAction({
      ...this.props.project,
      ...this.state
    })

    if(this.props.onClick){
      this.props.onClick()
    }
  }

  deleteProject(){
    this.props.deleteProjectAction(this.props.project)
    if(this.props.onClick){
      this.props.onClick()
    }
  }

  onChange(key:string,value:any){
    const s:any = {}
    s[key] = value
    this.setState(s)
  }

  render(){
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
            <Button type="primary" onClick={()=>this.saveProject()}>保存更新</Button>
          </Flex.Item>
          <Flex.Item>
          <Button type="warning" onClick={()=>this.deleteProject()}>删除项目</Button>
          </Flex.Item>
        </Flex>

      </div>
    );
  }
}

// export default SettingProject;

export default connect(
  null,
  { setProjectAction,deleteProjectAction }
)(SettingProject);