import React from 'react';
import "./ItemCard.css";
import { WhiteSpace, WingBlank, List,Checkbox } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

interface IItemCardProps{
  complete:boolean,
  desc:string,
  title:string,
  onSwitch?:Function
  onTitleClick?:Function
}

interface IItemCardState{
  checked:boolean
}

class ItemCard extends React.Component<IItemCardProps,IItemCardState>{
  constructor(props:IItemCardProps){
    super(props)
    this.state={
      checked:props.complete
    }
  }

  handleSwitchClick(){
    const checked = !this.state.checked
    if(this.props.onSwitch){
      this.props.onSwitch(checked)
    }
    this.setState({checked:checked})

  }

  onTitleClick(){
    if(this.props.onTitleClick){
      this.props.onTitleClick()
    }
  }

  render(){
    return (
      <div className="item-card">
      <WhiteSpace/>
        <WingBlank>
          <div className={`background-color-white ${this.state.checked?"complete":"active"}`} >
            <div className="flex" style={{justifyContent:'space-between'}}>
              <h3 className="title" onClick={()=>this.onTitleClick()}>{this.props.title}</h3>
              <List>
                <List.Item>
                  <CheckboxItem 
                    checked={this.state.checked}
                    onChange={()=>this.handleSwitchClick()}
                  >
                  </CheckboxItem>
                </List.Item>
              </List>
            </div>
            <div className="text-left" style={{height:'2rem',overflow:'hidden'}}>
              {this.props.desc}
            </div>
          </div>
        </WingBlank>
      </div>

    )
  }
}


export default ItemCard;