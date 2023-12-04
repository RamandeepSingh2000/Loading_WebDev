import React, {Component} from "react";
import { Link } from "react-router-dom";

export default class ItemCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div class="col">
      <div class="card h-100 border-success mb-3" style={{width: 18 + "rem"}}>
        <Link to={"/game-info/" + this.props.game._id} className="nav-link" >
          <img class="card-img-top rounded img-thumbnail" 
          style={{width: 90 + "%", height: 90 + "%", alignContent: 'center'}}
          src={this.props.game.displayImageURL} 
          alt={this.props.game.name} />
        </Link>
        <div class="card-body">
        <h5 class="card-title">{this.props.game.name}</h5>
        <div class="card-footer bg-transparent border-success">
        <p class="card-text">Price: ${this.props.game.price}</p>
        </div>          
        </div>
      </div>   
      </div>   
    )
  }
}

{/* <div class="col-sm">
      <div class="hover01 column">
      <Link to={"/game-info/" + this.props.game._id} className="nav-link">
            <figure>
              <img
                src={this.props.game.displayImageURL}
                alt={this.props.game.name}
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </figure>
          </Link>
      </div>
      <h3 class="harshal_text">{this.props.game.name}</h3>
      <h3 class="rate_text">{this.props.game.price}</h3>
      </div> */}