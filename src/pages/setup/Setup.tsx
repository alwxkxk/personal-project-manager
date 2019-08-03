import React from "react";
import { connect } from "react-redux";
import { Stepper, List, WingBlank, ActionSheet, Toast } from "antd-mobile";
import {setNavbarTitle,setGlobalSetups, setGlobalUser, setTask, setProjectAction} from "../../redux/actions";
import logo from "../../img/logo.png";
import './Setup.css';
import { userAvailable, fetchFromServer, pushToServer } from "../../parse-server";
import Parse from "parse";
import store from "../../redux/store";
import moment from "moment";


const mapStateToProps =(state:any)=>{
  const {setups,user} = state.global;
  return {setups,user}
}

class Setup extends React.PureComponent<any,any> {
  constructor(props:any){
    super(props)
    this.props.setNavbarTitle("设置")
  }

  changeWorkTime(hours:number){
    this.props.setGlobalSetups({
      ...this.props.setups,
      workTime:hours
    })
  }

  synchronize=()=>{
    Toast.loading("数据同步中",10);
    const tasks = store.getState().tasks;
    const projects = store.getState().projects;
    const oldBackupTime = this.props.setups.backupTime;
    const newBackupTime = moment().format();
    const pushTasks = tasks.filter((t:ITask)=>t.updateTime>oldBackupTime);
    const pushProjects = projects.filter((p:IProject)=>p.updateTime>oldBackupTime);
    let updateTaskCount = 0;
    let updateProjectCount = 0;
    // update data from server
    const pm1 = fetchFromServer(oldBackupTime)
    .then((res)=>{
      res.projects.forEach((newProject:IProject)=>{
        let oldProject = projects.find((p:IProject)=>p.uuid === newProject.uuid);
        // create project when not exist ,update project when it's updateTime is much newer.
        if(!oldProject || oldProject.updateTime < newProject.updateTime){
          this.props.setProjectAction(newProject);
          updateProjectCount ++;
          // debugger;
        }
      })
      res.tasks.forEach((newTask:ITask)=>{
        let oldTask = tasks.find((t:IProject)=>t.uuid === newTask.uuid);
        if(!oldTask || oldTask.updateTime < newTask.updateTime){
          this.props.setTask(newTask);
          updateTaskCount ++;
          // debugger;
        }
      })
      // debugger;
    })

    // put data to server
    const pm2 = pushToServer(pushProjects,pushTasks,newBackupTime);
    // set backupTime

    return Promise.all([pm1,pm2])
    .then(()=>{
      Toast.success(
      <div>
        <div>本地更新{updateProjectCount}项目，{updateTaskCount}任务</div>
        <div>推送云端{pushProjects.length}项目，{pushTasks.length}任务</div>
      </div>
      ,5)
      this.props.setGlobalSetups({
        ...this.props.setups,
        backupTime:newBackupTime
      })
    })

  }

  handleClickAvatar=()=>{
    if(userAvailable()){
      const BUTTONS = ['退出帐号','数据同步'];
      ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        maskClosable: true,
      },
      (buttonIndex) => {
        
        switch (buttonIndex) {
          case 0:
            //logout and clean user data
            Parse.User.logOut()
            this.props.setGlobalUser({});
            Toast.success("成功退出帐号")
            break;
          case 1:
            this.synchronize();
            break;
          default:
            break;
        }

      });
    }
    else if(process.env.REACT_APP_GITHUB_CLIENT_ID){
      const BUTTONS = ['登陆帐号'];
      ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        maskClosable: true,
      },
      (buttonIndex) => {
        
        switch (buttonIndex) {
          case 0:
            // github oauth 
            window.location.replace("https://github.com/login/oauth/authorize?client_id="+process.env.REACT_APP_GITHUB_CLIENT_ID);
            break;
        
          default:
            break;
        }
      });
    }
  }


  render(){
    const setups = this.props.setups || {}
    const user = this.props.user || {}
    return (
      <div className="page setup"> 
        <WingBlank>
          <div className="emerge">
            <img className="avatar-img" src={user.avatar_url || logo} alt="avatar" onClick={this.handleClickAvatar}/>
            <div className="name">{user.name || "未登陆"}</div>
          </div>

          <List className="emerge">

            
            <List.Item
            >
              云端备份：{setups.backupTime?moment(setups.backupTime).format('YYYY-MM-DD HH:mm:ss'):'无'}
            </List.Item>

            <List.Item
              extra={
                //@ts-ignore
                <Stepper
                  style={{ width: '100%'}}
                  showNumber
                  max={12}
                  min={0}
                  step={1}
                  value={setups.workTime}
                  onChange={(v)=>this.changeWorkTime(v)}
                ></Stepper>
              }
            >
              每天投入<sub>/小时</sub>
            </List.Item>


          </List>

        </WingBlank>
      </div>

    )
  }
}

export default connect(
  mapStateToProps,
  {setNavbarTitle,setGlobalSetups,setGlobalUser,setProjectAction,setTask}
  )(Setup)