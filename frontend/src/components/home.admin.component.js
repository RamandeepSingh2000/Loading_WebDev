import React, {Component} from "react";

import GamesGridAdmin from "./gamesgrid.admin.component";

export default class HomeAdmin extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>        
        <GamesGridAdmin/>
      </div>
    )
  }
}