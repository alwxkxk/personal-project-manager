import React from 'react';
import {setNavbarTitle} from "../../redux/actions";
import { connect } from "react-redux";



class Home extends React.Component<any> {
  constructor(props:any){
    super(props)
    this.props.setNavbarTitle("首页")
  }


  render(){
    return (
      <div className="page">


        <div>Home page</div>
        <div>Home page</div>
      </div>
  
    );
  }

}

// export default Home;

export default connect(
  null,
  {setNavbarTitle}
)(Home);