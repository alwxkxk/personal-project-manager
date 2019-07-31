import React from 'react';
import { connect } from "react-redux";
import { WingBlank, Card, WhiteSpace, Modal } from 'antd-mobile';
import moment  from 'moment';
import { Link } from "react-router-dom";
import {setGlobalProject,setGlobalTasksByProjectId} from "../../../redux/actions";
import SettingProject from './SettingProject';
import setIcon from '../../../img/set_icon.svg';

const mapStateToProps = (state:any)=>{
  const {projects} = state;
  // console.log("ProjectList mapStateToProps",projects,state)
  return {projects};
}

const sortFunc = (a:IProject,b:IProject)=>{
  //@ts-ignore
  return new Date(b.updateTime) - new Date(a.updateTime);
}

class ProjectList extends React.Component<any,any> {
  constructor(props:any){
    super(props)
    this.state={
      modal:false,
      project:{}
    }
  }
  handleClick(project:IProject){
    this.props.setGlobalProject(project);
    this.props.setGlobalTasksByProjectId(project.uuid)
  }
  
  render(){
    // console.log("ProjectList render",this.props)
    const projects = this.props.projects.sort(sortFunc);
    const activeProjects:IProject[] = [];
    const completeProjects:IProject[] = [];
    const deleteProjects:IProject[] = [];

    projects.forEach((p:IProject) => {
      if(p.delete){
        deleteProjects.push(p);
      }
      else if(p.complete){
        completeProjects.push(p);
      }
      else{
        activeProjects.push(p);
      }
    });



    const activeProjectsList = activeProjects.map((p:IProject)=>{
      return (
        <div key={p.uuid}>
          <WingBlank size="lg">
            <WhiteSpace size="sm" />
            <Card>
                <Card.Header
                  title={
                    <Link to={`/Project/${p.uuid}`} onClick={()=>this.handleClick(p)}>
                      <div>{p.title}</div>
                    </Link>
                  }
                  extra={
                    <div className="flex" style={{justifyContent:'flex-end'}}>
                      <img 
                      src={setIcon} 
                      alt="set_icon"
                      style={{width:'3rem'}}
                      className="icon"
                      onClick={()=>this.setState({modal:true,project:p})}
                      ></img>

                    </div>
                }
                />
              
              <Card.Body>
                <div className="text-left text-white">{p.desc}</div>
              </Card.Body >
              <Card.Footer 
                content={"创建：" + (p.createTime?moment(p.createTime).format('YYYY-MM-DD'):'')}
                extra={'截止: '+ (p.deadline?moment(p.deadline).format('YYYY-MM-DD'):'无')} 
              />
            </Card>
            <WhiteSpace size="sm" />
          </WingBlank>


        </div>

      )
    })

    const generateElement= (projects:IProject[],navText:string)=>{
      if(projects.length>0){
        const projectsList = projects.map((p:IProject)=>{
          return (
            <div key={p.uuid}>
              <WingBlank size="lg">
                <WhiteSpace size="sm" />
                <div className="project-inactive">
                  <div>
                    <Link to={`/Project/${p.uuid}`} onClick={()=>this.handleClick(p)}>
                      <div className="title">{p.title}</div>
                    </Link>
                  </div>
                  <div>
                    <img 
                    src={setIcon} 
                    alt="set_icon"
                    style={{width:'3rem'}}
                    className="icon"
                    onClick={()=>this.setState({modal:true,project:p})}
                    ></img>
                  </div>
                </div>
              </WingBlank>
            </div>
          )
        })
        return (
          <div>
            <div>{navText}:{projects.length}</div>
            {projectsList}
          </div>
        );
      }
    }

    
    
    return (
      <div className="fly-in">
        {activeProjectsList}
        {generateElement(completeProjects,"已完成")}
        {generateElement(deleteProjects,"回收箱")}

        <Modal
            visible={this.state.modal}
            transparent
            // maskClosable={false}
            onClose={()=>this.setState({modal:false})}
            title="项目设置"
            closable={true}
          >
            <div style={{ overflow: 'scroll' }}>
              <SettingProject
                project={this.state.project}
                onClick={()=>this.setState({modal:false})}
              ></SettingProject>
            </div>
        </Modal>
      </div>
    );
  }


}

// export default ProjectList;

export default connect(
  mapStateToProps,
  {setGlobalProject,setGlobalTasksByProjectId}
)(ProjectList);