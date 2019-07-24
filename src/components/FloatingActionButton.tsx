import React from 'react';
import { Button } from 'antd-mobile';
import add from '../img/add.svg';

interface FloatingActionButtonProps {
  onClick: Function;
}


class FloatingActionButton extends React.Component<FloatingActionButtonProps> {

  render(){
    return (
      <Button type="primary" 
      size="large" 
      onClick={()=>this.props.onClick()}
      style={{
        position:'fixed',
        bottom:'1rem',
        right:'1rem',
        width:'2.5rem',
        height:'2.5rem',
        borderRadius:'50%',
        zIndex: 2
      }}>

        <div className="full" style={{
          background:`url(${add}) center center /  1.5rem 1.5rem no-repeat`
        }}>
        </div>

      </Button>
    );   
  }
}


export default FloatingActionButton;