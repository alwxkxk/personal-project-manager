import React from 'react';
import { connect } from "react-redux";
import { WingBlank, Card, WhiteSpace } from 'antd-mobile';
import moment  from 'moment';

const mapStateToProps = (state:IProject[])=>{
  const projects = state;
  return projects;
}

const sortFunc = (a:IProject,b:IProject)=>{
  //@ts-ignore
  return new Date(b.updateTime) - new Date(a.updateTime);
}
class ProjectList extends React.Component<any> {

  render(){
    // console.log("ProjectList render",this.props)
    
    const list = this.props.projects.sort(sortFunc).map((p:any)=>{
      return (
        <WingBlank size="lg" key={p.uuid}>
          <WhiteSpace size="sm" />
          <Card>
            <Card.Header
              title={p.title}
              thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
              extra="进度：24/64"
            />
            <Card.Body>
              <div className="text-left">{p.desc}</div>
            </Card.Body >
            <Card.Footer content="状态：未完成" extra={'截止日期: '+ (p.deadline?moment(p.deadline).format('YYYY-MM-DD'):'无')} />
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
  mapStateToProps
)(ProjectList);