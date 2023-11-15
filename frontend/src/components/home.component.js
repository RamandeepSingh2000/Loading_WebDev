import React, {Component} from "react";

import GamesGrid from "./gamesgrid.component";

export default class Home extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        
        <GamesGrid/>


      </div>
    )
  }
}