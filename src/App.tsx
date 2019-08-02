import React from 'react';
import {NavBar, Drawer, List, Toast}  from 'antd-mobile';
import Projects from './pages/projects/Projects';
import Home from './pages/home/Home';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Project from './pages/project/Project';
import { connect } from "react-redux";
import Setup from './pages/setup/Setup';
import navIcon from "./img/nav_icon.svg"
import Oauth from './pages/oauth/Oauth';



const mapStateToProps = (state:any) => {
  const {global} = state;
  // console.log("app mapStateToProps",global,state)
  return global;
}

const sidebar = (
  <List>
    <List.Item>
      <Link to="/"><div className="nav-circle nav-color-1"></div>首页</Link>
    </List.Item>
    <List.Item>
      <Link to="/projects"><div className="nav-circle nav-color-2"></div>所有项目</Link>
    </List.Item>
    <List.Item>
      <Link to="/setup"><div className="nav-circle nav-color-3"></div>设置</Link>
    </List.Item>
  </List>
)


class App extends React.Component<any> {
  state = {
    open: false,
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  componentDidMount(){
    if(window.innerWidth>768){
      Toast.fail("暂时只支持小屏设备，将会出现样式异常。",10)
    }
    // testSave()
    // testAddUser('16029024','ec0ce012ab866d7f1b3e1c6a3ef1aec4b6f53118')
    // testAddUserByAnonymous("alwqwe")
    // loginByAnonymous("alwqwe")

    // if(Parse.User.current()){
    //   testCloudFunction()
    // }
    // else{
    //   loginByGithub('16029024','ec0ce012ab866d7f1b3e1c6a3ef1aec4b6f53118')
    //   .then(()=>testCloudFunction())
    // }
  }

  render(){
    return (
     
        <Router>
          <NavBar 
            leftContent={<img className="icon" 
            src={navIcon} alt="navIcon"></img>}  
            onLeftClick={this.onOpenChange}
            >
            {this.props.navTitle}
          </NavBar>
          <Drawer
            className="drawer"
            style={{ minHeight: '100vh' }}
            enableDragHandle
            contentStyle={{ color: '#A6A6A6', textAlign: 'center'}}
            sidebar={sidebar}
            open={this.state.open}
            onOpenChange={this.onOpenChange}
          >
            <Route path="/" exact component={Home} />
            <Route path="/index" component={Home} />
            <Route path="/project/" component={Project} />  
            <Route path="/projects/" component={Projects} />  
            <Route path="/setup/" component={Setup} />  
            <Route path="/oauth/" component={Oauth} />  
          </Drawer>
        </Router>
    );
  }

}



// export default App;

export default connect(
  mapStateToProps,
  null
)(App);
