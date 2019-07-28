import React from 'react';
import { List, InputItem, WhiteSpace, TextareaItem, Button } from 'antd-mobile';
import { taskType } from '../schema/Task';

// circle button style 
const circleActive1 = "circle-btn background-color-1 text-white";
const circleActive2 = "circle-btn background-color-2 text-white";
const circleActive3 = "circle-btn background-color-3 text-white";
const circleActive4 = "circle-btn background-color-4 text-white";

const circle1 = "circle-btn border-color-1 text-black";
const circle2 = "circle-btn border-color-2 text-black";
const circle3 = "circle-btn border-color-3 text-black";
const circle4 = "circle-btn border-color-4 text-black";


interface IAddingTaskProps{
  title:string,
  desc:string,
  workload:number,
  taskType:taskType,
  onChange:Function,
}

class SettingTaskCommon extends React.PureComponent<IAddingTaskProps> {

  render(){
    return (
      <List>
        <InputItem
        placeholder="新任务名"
        value={this.props.title}
        onChange={v => this.props.onChange('title',v)}
        >名称</InputItem>

        <WhiteSpace/>

        <TextareaItem
          title="描述"
          placeholder="..."
          rows={3}
          value={this.props.desc}
          onChange={v => this.props.onChange('desc',v)}
        >

        </TextareaItem>
        


        <div className="flex am-list-item" style={{justifyContent:'space-between'}}>
          <div className="am-input-label">时间<sub style={{fontSize:'0.01rem'}}>/小时</sub></div>
          <div className="flex">
            <Button className={this.props.workload === 1 ? circleActive1 :circle1 } onClick={()=>this.props.onChange('workload',1)}>1</Button>
            <Button className={this.props.workload === 2 ? circleActive2 :circle2 } onClick={()=>this.props.onChange('workload',2)}>2</Button>
            <Button className={this.props.workload === 4 ? circleActive3 :circle3 } onClick={()=>this.props.onChange('workload',4)}>4</Button>
            <Button className={this.props.workload === 8 ? circleActive4 :circle4 } onClick={()=>this.props.onChange('workload',8)}>8</Button>
          </div>
        </div>

        <div className="flex am-list-item" style={{justifyContent:'space-between'}}>
          <div className="am-input-label">任务类型</div>
          <div className="flex ">
            <Button className={this.props.taskType === taskType.prior ? circleActive2 :circle2 } onClick={()=>this.props.onChange('taskType',taskType.prior)}>前期</Button>
            <Button className={this.props.taskType === taskType.middle ? circleActive3 :circle3} onClick={()=>this.props.onChange('taskType',taskType.middle)}>中期</Button>
            <Button className={this.props.taskType === taskType.last ? circleActive4 :circle4} onClick={()=>this.props.onChange('taskType',taskType.last)}>后期</Button>
          </div>
        </div>
      </List>
    )
  }
}

export default SettingTaskCommon;