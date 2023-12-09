import React, {Component} from "react";

import GamesGridAdminUnpublished from "./gamesgrid.admin.unpublished.component";

export default class Unpublished extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>        
        <GamesGridAdminUnpublished/>
      </div>
    )
  }
}