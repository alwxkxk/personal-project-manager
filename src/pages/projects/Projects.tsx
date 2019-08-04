import React from 'react';
import {  Modal } from 'antd-mobile';
import ProjectList from './components/ProjectList';
import FloatingActionButton from '../../components/FloatingActionButton';
// import ProjectSetting from './components/ProjectSetting';
import AddingProject from './components/AddingProject';
import { connect } from "react-redux";
import {setNavbarTitle} from "../../redux/actions";
import "./Projects.css";



class Projects extends React.Component<any,{modal:boolean}>{
  constructor(props:any){
    super(props);
    this.state={
      modal:false
    }
    this.props.setNavbarTitle('所有项目');
  }

  render() {
    return (
      <div className="page projects">

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

// export default Projects;

export default connect(
  null,
  {setNavbarTitle}
)(Projects);