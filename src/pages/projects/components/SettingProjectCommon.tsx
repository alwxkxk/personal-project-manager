import  React from "react";
import { List, InputItem, WhiteSpace, TextareaItem, DatePicker } from "antd-mobile";
import moment from "moment";

interface ISettingProjectCommon {
  title:string,
  desc:string,
  deadline:string,
  onChange:Function
}

class SettingProjectCommon extends React.Component<ISettingProjectCommon,any> {
  constructor(props:ISettingProjectCommon) {
    super(props);
  }

  render(){
    return (
    <div>
        <List>
          <InputItem
          placeholder="新项目名"
          value={this.props.title}
          onChange={v => this.props.onChange('title',v)}
          >名称</InputItem>

          <WhiteSpace/>

          <TextareaItem
            placeholder="..."
            title="描述"
            rows={3}
            value={this.props.desc}
            onChange={v => this.props.onChange('desc',v)}
          >

          </TextareaItem>

          <DatePicker
            mode="date"
            minDate={moment().toDate()}
            onChange={v => this.props.onChange('deadline',moment(v).format())}
            value={this.props.deadline?moment(this.props.deadline).toDate():undefined}
          >
            <List.Item arrow="horizontal">截止日期</List.Item>
          </DatePicker>
        </List>
    </div>
    )
  }


}


export default SettingProjectCommon;