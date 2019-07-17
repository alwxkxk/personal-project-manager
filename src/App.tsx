import React from 'react';
import {Icon,Menu,Dropdown}  from 'antd';
import Projects from './pages/projects/Projects';
import logo from './logo.svg';
import Home from './pages/home/Home';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function Users() {
  return <h2>Users</h2>;
}

const menu = (
  <Menu>
    <Menu.Item ><Link to="/">Home</Link></Menu.Item>
    <Menu.Item><Link to="/projects/">projects</Link></Menu.Item>
    <Menu.Item><Link to="/users/">Users</Link></Menu.Item>
  </Menu>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="header flex">
        <div className="title">personal project manager </div>
        <div className="avatar">
          <img alt="avatar" src={logo} className="full"></img>
        </div>
        
        <Dropdown overlay={menu}>
          <Icon type="menu"  className="menu"/>
        </Dropdown>
      </div>

      <div>
        <Route path="/" exact component={Home} />
        <Route path="/projects/" component={Projects} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default App;
