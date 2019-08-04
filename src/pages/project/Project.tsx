import React from 'react';
import FloatingActionButton from '../../components/FloatingActionButton';
import { Modal } from 'antd-mobile';
import AddingTask from '../../components/AddingTask';
import {setNavbarTitle} from "../../redux/actions";
import { connect } from "react-redux";
import TaskList from '../../components/TaskLIst';
// import ProjectState from '../../components/ProjectState';

const mapStateToProps = (state:any) => {
  const {project} = state.global;
  return {project};
}

class Project extends React.Component<any,{modal:boolean}>{
  constructor(props:any){
    super(props);
    this.state={
      modal:false
    }

    if(this.props.project){
      this.props.setNavbarTitle("项目："+this.props.project.title);
    }
    else{
      this.props.history.push('/Projects')
    }


  }
  render(){
    const projectId = this.props.location.pathname.split('/').pop();
    if(!projectId){
      debugger;
      console.log(projectId)
    }
    return (
      <div className="page">

        {/* <ProjectState></ProjectState> */}
        <TaskList></TaskList>
        <FloatingActionButton onClick={()=>this.setState({modal:true})}></FloatingActionButton>

        <Modal
          visible={this.state.modal}
          transparent
          // maskClosable={false}
          onClose={()=>this.setState({modal:false})}
          title="新增任务"
          closable={true}
        >
          <div style={{ overflow: 'scroll' }}>
            <AddingTask onClick={()=>this.setState({modal:false})} projectId={projectId}></AddingTask>
          </div>
        </Modal>
    </div>
    )
  }
}


// export default Project;

export default connect(
  mapStateToProps,
  {setNavbarTitle}
)(Project);