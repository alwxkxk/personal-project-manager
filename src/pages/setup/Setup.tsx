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
  fileUploadRef:React.RefObject<any>

  constructor(props:any){
    super(props)
    this.props.setNavbarTitle("设置")
    this.fileUploadRef = React.createRef();
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
      )
      this.props.setGlobalSetups({
        ...this.props.setups,
        backupTime:newBackupTime
      })
    })

  }

  exportData=()=>{
    const a = document.createElement('a');
    const data={
      tasks:store.getState().tasks,
      projects:store.getState().projects
    }
    a.setAttribute('href', 
    'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(data)) 
    );
    a.setAttribute('download', moment().format('YYYY-MM-DD HH-mm-ss')+'.json');
    a.click()
  }

  importData=()=>{
    this.fileUploadRef.current.click();
  }

  uploadFile = ()=>{
    const reader = new FileReader();

    reader.onload = ()=>{
      //@ts-ignore
      const data = JSON.parse(reader.result || '')
      console.log("uploadFile:",data)
      if(data){
        data.projects.forEach((p:IProject)=>{
          this.props.setProjectAction(p);
        })
        data.tasks.forEach((t:ITask)=>{
          this.props.setTask(t);
        })
        Toast.success(`已导入${data.projects.length}项目，${data.tasks.length}任务`)
      }
    };

    reader.readAsText(this.fileUploadRef.current.files[0],'utf-8')
  }

  handleClickAvatar=()=>{
    if(userAvailable()){
      const BUTTONS = ['退出帐号','数据同步','导出离线数据','导入离线数据'];
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
          case 2:
            this.exportData();
            break;
          case 3:
            this.importData();
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
          <input type="file" ref={this.fileUploadRef} accept=".json,application/json" className="hide" onChange={this.uploadFile}/> 
        </WingBlank>
      </div>

    )
  }
}

export default connect(
  mapStateToProps,
  {setNavbarTitle,setGlobalSetups,setGlobalUser,setProjectAction,setTask}
  )(Setup)