import React from 'react';
import "./Task.css";
import { WhiteSpace, WingBlank,Checkbox, Modal } from 'antd-mobile';
import SettingTask from './SettingTask';
import {connect} from 'react-redux';
import {setTask} from '../redux/actions';
import moment from 'moment';

const CheckboxItem = Checkbox.CheckboxItem;
interface ITaskProps{
  task:ITask,
  setTask:Function,
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
   this.props.setTask({
     ...this.props.task,
      complete:checked,
      completeTime:moment().format()
   })
  }

  render(){
    const task = this.props.task || {}
    return (
      <div className="task">
      <WhiteSpace/>
        <WingBlank size="lg">
          <div className="flex item">
            <div className="tip-box"></div>
            <div className="flex content text-white full">
              <div className="flex space-between">
                <div className="title " onClick={this.openModal} >{task.title || '未命名'}</div>
                  <CheckboxItem 
                    defaultChecked={task.complete}
                    onChange={this.handleSwitchClick}
                  >
                  </CheckboxItem>
              </div>
              
              <div className="desc">{task.desc}</div>
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
