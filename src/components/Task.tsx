import React from 'react';
import "./Task.css";
import { WhiteSpace, WingBlank,Checkbox, Modal, Toast } from 'antd-mobile';
import SettingTask from './SettingTask';
import {connect} from 'react-redux';
import {setTask} from '../redux/actions';
import moment from 'moment';

const CheckboxItem = Checkbox.CheckboxItem;
interface ITaskProps{
  task:ITask,
  setTask:Function,
  className?:String,
  style?:any
}

class Task extends React.Component<ITaskProps,any>{
  constructor(props:ITaskProps){
    super(props);
    this.state={
      modal:false
    }
  }

  openModal=()=>{
    this.setState({modal:true})
  }

  closeModal=()=>{
    this.setState({modal:false})
  }

  handleSwitchClick=(e:any)=>{
  const checked = e.target.checked;
  if(checked){
    Toast.success("完成任务");
  }
   this.props.setTask({
     ...this.props.task,
      complete:checked,
      completeTime:moment().format()
   })
  }

  render(){
    const task = this.props.task || {}
    let tipBoxColor;
    let activeFlag = true;
    if(task.delete || task.complete){
      activeFlag = false;
    }

    switch (task.workload) {
      case 1:
        tipBoxColor = "background-color-1"
        break;
      case 2:
        tipBoxColor = "background-color-2"
        break;
      case 3:
        tipBoxColor = "background-color-3"
        break;
      case 4:
        tipBoxColor = "background-color-4"
        break;    
      default:
        break;
    }
   

    return (
      <div className={`task slide-in ${this.props.className}`} style={this.props.style}>
      <WhiteSpace/>
        <WingBlank size="lg">
          <div className="flex item">
            <div className={`tip-box ${tipBoxColor} ${activeFlag?'':'background-color-gray'}`}></div>
            <div className={`flex content ${activeFlag?'text-white':'text-gray'} full`}>
              <div className="flex space-between">
                <div className="title " onClick={this.openModal} >{task.title || '未命名'}</div>

                {
                  !task.delete && 
                  <CheckboxItem 
                    defaultChecked={task.complete}
                    onChange={this.handleSwitchClick}
                  >
                  </CheckboxItem>
                }

              </div>
              
              <div className={`desc ${activeFlag?'text-white':'text-gray'} `}>{task.desc}</div>
            </div>
            
          </div>
        </WingBlank>

        <Modal
          visible={this.state.modal}
          transparent
          // maskClosable={false}
          onClose={this.closeModal}
          title="任务设置"
          closable={true}
        >
          <div style={{ overflow: 'scroll' }}>
            <SettingTask task={this.props.task} onClick={this.closeModal}></SettingTask>
          </div>
        </Modal>

      </div>

    )
  }
}


// export default Task;

export default connect(
  null,
  {setTask}
  )(Task);
