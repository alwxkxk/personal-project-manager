import React from 'react';
import moment from 'moment';
import { InputItem, List, WhiteSpace, TextareaItem, DatePicker, Button } from 'antd-mobile';
import { addProjectAction } from "../../../redux/actions";
import { connect } from "react-redux";

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

  render(){
    return (
      <div >
        <List>
          <InputItem
          placeholder="新项目名"
          value={this.state.title}
          onChange={v => this.setState({ title:v })}
          >名称</InputItem>

          <WhiteSpace/>

          <TextareaItem
            placeholder="..."
            title="描述"
            rows={3}
            value={this.state.desc}
            onChange={v => this.setState({ desc:v })}
          >

          </TextareaItem>

          <DatePicker
            mode="date"
            minDate={moment().toDate()}
            onChange={date => this.setState({ deadline:date })}
            value={this.state.deadline}
          >
            <List.Item arrow="horizontal">截止日期</List.Item>
          </DatePicker>
          
          <Button type="primary" onClick={()=>this.handleClick()}>创建</Button>

        </List>
      </div>
    );
  } 
}


// export default AddingProject;

export default connect(
  null,
  { addProjectAction }
)(AddingProject);