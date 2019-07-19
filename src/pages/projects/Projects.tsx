import React from 'react';
import {  Modal } from 'antd-mobile';
import ProjectList from './components/ProjectList';
import FloatingActionButton from '../../components/FloatingActionButton';
// import ProjectSetting from './components/ProjectSetting';
import AddingProject from './components/AddingProject';
import './Projects.css';

class Projects extends React.Component<{},{modal:boolean}>{
  constructor(props:any){
    super(props);
    this.state={
      modal:false
    }
  }

  render() {
    return (
      <div className="page">

        <FloatingActionButton onClick={()=>this.setState({modal:true})}></FloatingActionButton>

        <Modal
          visible={this.state.modal}
          transparent
          // maskClosable={false}
          onClose={()=>this.setState({modal:false})}
          title="新增项目"
          closable={true}
        >
          <div style={{ overflow: 'scroll' }}>
            <AddingProject onClick={()=>this.setState({modal:false})}></AddingProject>
          </div>
        </Modal>
        <ProjectList></ProjectList>
      </div>

    );
  }
}

export default Projects;