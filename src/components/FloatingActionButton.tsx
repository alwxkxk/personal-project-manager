import React from 'react';
import { Button } from 'antd-mobile';
import add from '../img/add.svg';

interface FloatingActionButtonProps {
  onClick: Function;
}


class FloatingActionButton extends React.Component<FloatingActionButtonProps> {
  constructor(props:any) {
    super(props);
  }
  render(){
    return (
      <Button type="primary" 
      size="large" 
      onClick={()=>this.props.onClick()}
      style={{
        position:'fixed',
        bottom:30,
        right:30,
        width:48,
        height:48,
        borderRadius:'50%',
        zIndex: 99
      }}>

        <div className="full" style={{
          background:`url(${add}) center center /  32px 32px no-repeat`
        }}>
        </div>

      </Button>
    );   
  }
}


export default FloatingActionButton;