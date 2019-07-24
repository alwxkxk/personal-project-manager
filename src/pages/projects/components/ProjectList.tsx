import React from 'react';
import { connect } from "react-redux";
import { WingBlank, Card, WhiteSpace, Button } from 'antd-mobile';
import moment  from 'moment';
import { Link } from "react-router-dom";
import {setGlobalProject,setGlobalTasksByProjectId} from "../../../redux/actions";

const mapStateToProps = (state:any)=>{
  const {projects} = state;
  // console.log("ProjectList mapStateToProps",projects,state)
  return {projects};
}

const sortFunc = (a:IProject,b:IProject)=>{
  //@ts-ignore
  return new Date(b.updateTime) - new Date(a.updateTime);
}


class ProjectList extends React.Component<any> {
  handleClick(project:IProject){
    this.props.setGlobalProject(project);
    this.props.setGlobalTasksByProjectId(project.uuid)
  }
  
  render(){
    // console.log("ProjectList render",this.props)
    
    const list = this.props.projects.sort(sortFunc).map((p:any)=>{
      return (
        <WingBlank size="lg" key={p.uuid}>
          <WhiteSpace size="sm" />
          <Card>
              <Card.Header
                title={
                  <Link to={`/Project/${p.uuid}`} onClick={()=>this.handleClick(p)}>
                    <div>{p.title}</div>
                  </Link>
                }
                // thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                extra={
                  <div className="flex" style={{justifyContent:'flex-end'}}>
                    <Button icon="ellipsis" size="small" style={{width:'3rem'}}></Button>
                  </div>
              }
              />
            

            <Card.Body>
              <div className="text-left">{p.desc}</div>
            </Card.Body >
            <Card.Footer 
              content={"创建：" + (p.createTime?moment(p.createTime).format('YYYY-MM-DD'):'')}
              extra={'截止: '+ (p.deadline?moment(p.deadline).format('YYYY-MM-DD'):'无')} 
            />
          </Card>
          <WhiteSpace size="sm" />
        </WingBlank>
      )
    })
    
    return (
      <div>
        {list}
      </div>
    );
  }


}

// export default ProjectList;

export default connect(
  mapStateToProps,
  {setGlobalProject,setGlobalTasksByProjectId}
)(ProjectList);