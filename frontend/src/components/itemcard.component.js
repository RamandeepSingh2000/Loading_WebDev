import React, {Component} from "react";
import { Link } from "react-router-dom";
// Helper function to convert the string to Uint8Array
const getImageFromBinary = data => {
  return URL.createObjectURL(new Blob([new Uint8Array(data)], { type: "image/png" }))
}

export default class ItemCard extends Component{
  constructor(props){
    super(props)
    this.state = {displayImage : props.game.displayImage == null ? null : getImageFromBinary(props.game.displayImage.data)};
  }
  render(){
    return(
      <div class="col-sm">
      <div class="hover01 column">
      <Link to={"/game-info/" + this.props.game._id} className="nav-link">
            <figure>
              <img
                src={this.state.displayImage}
                alt={this.props.game.name}
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </figure>
          </Link>
      </div>
      <h3 class="harshal_text">{this.props.game.name}</h3>
      <h3 class="rate_text">{this.props.game.price}</h3>
      </div>
    )
  }
}