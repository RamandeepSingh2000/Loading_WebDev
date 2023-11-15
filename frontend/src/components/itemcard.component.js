import React, {Component} from "react";
import gameImage from '../images/game.svg'

export default class ItemCard extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div class="col-sm">
          <div class="hover01 column">
            <a class="nav-link" href="game-info">
              <figure><img src={gameImage} /></figure>
            </a>
          </div>
          <h3 class="harshal_text">Game Name</h3>
          <h3 class="rate_text">$10</h3>
      </div>
    )
  }
}