import React from 'react';
import {setNavbarTitle,setGlobalProject,setGlobalTasksByProjectId} from "../../redux/actions";
import { connect } from "react-redux";
import ProjectState from '../../components/ProjectState';
import TaskList from "../../components/TaskLIst";
import AddingTask from '../../components/AddingTask';
import addIcon from '../../img/add.svg';
import FloatingActionButton from '../../components/FloatingActionButton';
import { Modal } from 'antd-mobile';
import AddingProject from '../projects/components/AddingProject';

const mapStateToProps = (state:any)=>{
   const {global,projects} = state
  //  console.log("mapStateToProps:",global.tasks.length)
   return {global,projects}
}

const sortByCreateTime = (a:IProject,b:IProject)=>{
  //@ts-ignore
  return new Date(b.createTime) - new Date(a.createTime);
}

class Home extends React.Component<any,any> {
  constructor(props:any){
    super(props)
    this.props.setNavbarTitle("首页")

    this.state={
      modal:false
    }

    // show the last project
    let lastProject = this.props.projects && 
      this.props.projects.filter((p:IProject)=> !p.delete).sort(sortByCreateTime)[0]
    if(lastProject && this.props.global.project && this.props.global.project.uuid !== lastProject.uuid){
      this.props.setGlobalProject(lastProject);
      this.props.setGlobalTasksByProjectId(lastProject.uuid);
    }

  }

  closeModal=()=>{
    this.setState({modal:false})
  }

  openModal=()=>{
    this.setState({modal:true})
  }


  render(){
    
    const project = this.props.global.project || {};
    if(project.uuid){
      return (
        <div className="page">
        
          <div>{project.title}</div>
          <FloatingActionButton onClick={this.openModal}></FloatingActionButton>
          <ProjectState></ProjectState>
          
          <TaskList
            hideDelete={true}
          ></TaskList>
          
          <Modal
            visible={this.state.modal}
            transparent
            onClose={this.closeModal}
            title="新增任务"
            closable={true}
          >
            <div style={{ overflow: 'scroll' }}>
              <AddingTask projectId={project.uuid} onClick={this.closeModal}></AddingTask>
            </div>
          </Modal>
        </div>
    
      );
    }
    else{
      return (
        <div className="page">
          <div className="add-project" onClick={this.openModal}>
            <img src={addIcon} className="icon" alt="addIcon"></img>
            <div>添加项目</div>
          </div>

          <Modal
            visible={this.state.modal}
            transparent
            onClose={this.closeModal}
            title="新增项目"
            closable={true}
          >
            <div style={{ overflow: 'scroll' }}>
              <AddingProject onClick={this.closeModal}></AddingProject>
            </div>
          </Modal>
        </div>
      )
    }
  }


}

// export default Home;

export default connect(
  mapStateToProps,
  {setNavbarTitle,setGlobalProject,setGlobalTasksByProjectId}
)(Home);