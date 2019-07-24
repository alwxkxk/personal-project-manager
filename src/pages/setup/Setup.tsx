import React from "react";
import { connect } from "react-redux";
import { Stepper, List, WingBlank } from "antd-mobile";
import {setNavbarTitle,setGlobalSetups} from "../../redux/actions";

const mapStateToProps =(state:any)=>{
  const {setups} = state.global;
  return {setups}
}

class Setup extends React.Component<any,any> {
  constructor(props:any){
    super(props)
    this.state={
      workTime:this.props.setups.workTime || 0
    }
    this.props.setNavbarTitle("设置")
  }

  changeWorkTime(hours:number){
    this.setState({workTime:hours})
    this.props.setGlobalSetups({
      ...this.props.setups,
      workTime:hours
    })
  }


  render(){
    return (
      <WingBlank>
        <List>
          <List.Item
            extra={
              //@ts-ignore
              <Stepper
                style={{ width: '100%'}}
                showNumber
                max={12}
                min={0}
                step={1}
                value={this.state.workTime}
                onChange={(v)=>this.changeWorkTime(v)}
              ></Stepper>
            }
          >
            工作日时长<sub>/小时</sub>
          </List.Item>
        </List>

      </WingBlank>
    )
  }
}

export default connect(
  mapStateToProps,
  {setNavbarTitle,setGlobalSetups}
  )(Setup)