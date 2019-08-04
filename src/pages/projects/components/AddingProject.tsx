import React from 'react';
import { Button } from 'antd-mobile';
import { addProjectAction } from "../../../redux/actions";
import { connect } from "react-redux";
import SettingProjectCommon from './SettingProjectCommon';

interface IAddingProjectProps{
  addProjectAction:Function
  onClick?:Function
}

class AddingProject extends React.Component<IAddingProjectProps,any> {
  constructor(props:any) {
    super(props)

    this.state={
      deadline:null,
      title:'',
      desc:''
    }
  }

  handleClick(){
    this.props.addProjectAction(this.state);
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
      <div >
        <SettingProjectCommon
          title={this.state.title}
          desc={this.state.desc}
          deadline={this.state.deadline}
          onChange={(key:string,value:any)=>this.onChange(key,value)}
        >

        </SettingProjectCommon>
        <Button type="primary" onClick={()=>this.handleClick()}>创建</Button>
      </div>
    );
  } 
}


// export default AddingProject;

export default connect(
  null,
  { addProjectAction }
)(AddingProject);