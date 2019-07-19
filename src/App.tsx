import React from 'react';
import {Icon, NavBar, Drawer, List}  from 'antd-mobile';
import Projects from './pages/projects/Projects';
// import logo from './logo.svg';
import Home from './pages/home/Home';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { render } from 'react-dom';



const sidebar = (
  <List>
    <List.Item>
      <Link to="/">首页</Link>
    </List.Item>
    <List.Item>
      <Link to="/Projects">项目</Link>
    </List.Item>
  </List>
)
class App extends React.Component {
  state = {
    open: false,
  }
  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }
  render(){
    return (
     
        <Router>
          <NavBar icon={<Icon type="ellipsis" />}  onLeftClick={this.onOpenChange}>页面标题</NavBar>
          <Drawer
            className="my-drawer"
            style={{ minHeight: '100vh' }}
            enableDragHandle
            contentStyle={{ color: '#A6A6A6', textAlign: 'center'}}
            sidebar={sidebar}
            open={this.state.open}
            onOpenChange={this.onOpenChange}
          >
            <Route path="/" exact component={Home} />
            <Route path="/Projects/" component={Projects} />  
          </Drawer>
        </Router>
    );
  }

}



export default App;
