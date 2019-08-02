import React from "react";
import { connect } from "react-redux";
import { Stepper, List, WingBlank, ActionSheet, Toast } from "antd-mobile";
import {setNavbarTitle,setGlobalSetups, setGlobalUser} from "../../redux/actions";
import logo from "../../img/logo.png";
import './Setup.css';
import { userAvailable } from "../../parse-server";
import Parse from "parse";

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

  handleClickAvatar=()=>{
    if(userAvailable()){
      const BUTTONS = ['退出帐号'];
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
        
          default:
            break;
        }

      });
    }
    else if(process.env.REACT_APP_GITHUB_CLIENT_ID){
      // github oauth 
      window.location.replace("https://github.com/login/oauth/authorize?client_id="+process.env.REACT_APP_GITHUB_CLIENT_ID);
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
              云端备份：2019-8-24 12:23:11
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
  {setNavbarTitle,setGlobalSetups,setGlobalUser}
  )(Setup)