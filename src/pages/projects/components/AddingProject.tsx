import React from 'react';
import moment from 'moment';
import { InputItem, List, WingBlank, WhiteSpace, TextareaItem, DatePicker, Button, Flex } from 'antd-mobile';
import { addProject } from "../../../redux/actions";
import { connect } from "react-redux";

interface IAddingProjectProps{
  addProject:Function
  onClick?:Function
}

class AddingProject extends React.Component<IAddingProjectProps,{deadline:any,title:string,desc:any}> {
  constructor(props:any) {
    super(props)

    this.state={
      deadline:null,
      title:'新项目名称',
      desc:'...'
    }
  }

  handleClick(){
    this.props.addProject(this.state);
    if(this.props.onClick){
      this.props.onClick();
    }
  }

  render(){
    return (
      <div >
        <List>
          <InputItem
          value={this.state.title}
          onChange={v => this.setState({ title:v })}
          >名称</InputItem>

          <WhiteSpace/>

          <TextareaItem
            title="描述"
            rows={3}
            value={this.state.desc}
            onChange={v => this.setState({ desc:v })}
          >

          </TextareaItem>

          <DatePicker
            mode="date"
            title="Select Date"
            minDate={moment().toDate()}
            onChange={date => this.setState({ deadline:date })}
            value={this.state.deadline}
          >
            <List.Item arrow="horizontal">截止日期</List.Item>
          </DatePicker>
          
          <Button type="primary" onClick={()=>this.handleClick()}>确认</Button>

        </List>
      </div>
    );
  } 
}


// export default AddingProject;

export default connect(
  null,
  { addProject }
)(AddingProject);