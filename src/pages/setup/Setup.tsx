import React from "react";
import { connect } from "react-redux";
import { Stepper, List, WingBlank } from "antd-mobile";
import {setNavbarTitle,setGlobalSetups} from "../../redux/actions";
import './Setup.css';

const mapStateToProps =(state:any)=>{
  const {setups} = state.global;
  return {setups}
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


  render(){
    const setups = this.props.setups || {}
    return (
      <div className="page setup"> 
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
  {setNavbarTitle,setGlobalSetups}
  )(Setup)