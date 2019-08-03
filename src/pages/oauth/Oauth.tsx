import React from "react";
import { getGithubToken, loginByGithub } from "../../parse-server";
import axios, { AxiosResponse } from 'axios';
import { Toast } from "antd-mobile";
import {connect} from "react-redux";
import {setGlobalUser} from '../../redux/actions';



function getGithubUser(token:string) {
  return axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${token}`
    }
  })
  .then((response:AxiosResponse)=>{
    console.log(response)
    return Promise.resolve(response.data)

  })
}

// test http://localhost:3000/oauth/redirect?code=3086c2371c7aa6ba82d4
class Oauth extends React.PureComponent<any,any> {
  componentDidMount(){
    const code = this.props.location.search.split("=")[1]
    Toast.loading("授权登陆中",10);
    // TODO: refactor by await
    if(code){
      //take token from server
      getGithubToken(code)
      .then((token:string)=>{
        if(token){
          // get github user info 
          getGithubUser(token)
          .then((data:any)=>{
            if(data){
              return loginByGithub(data.id,token)
              .then(()=>{
                Toast.hide();
                Toast.success("登陆成功",3);
                this.props.setGlobalUser(data);
                // login success , go back to /setup
                this.props.history.replace("/setup")
                return Promise.resolve()
                // save data in global setup
              })
            }
            else{
              return Promise.reject("login fail");
            }
          })

        }
      })
      .catch(()=>{
        Toast.fail("登陆失败",3);
        this.props.history.replace("/setup")
      })
    }
    
    

   
    
  }
  render(){
    return (
      <div className="page">
        等待授权
      </div>
    )
  }
}

// export default Oauth;

export default connect(null,
  {setGlobalUser})(Oauth)