import React, {Component} from "react";
import ItemCard from "./itemcard.component";
import axios from "axios";
import helper from "../helper";

export default class GamesGridAdmin extends Component{
  constructor(props){
    super(props)
    this.state = {games: []}
  }

  componentDidMount(){
      
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/games/unpublished`,{
      headers: {
        Authorization: `Bearer ${helper.getAuthToken()}`,
      },
    })
      .then(res => this.setState({games: res.data}))
      .catch(e => console.log(e));
  }

  // //not sure if it should be done like this. making an api request every update.
  // componentDidUpdate(){
  //     axios.get('${process.env.SERVER_URL}/api/games?numberOfGames=20')
  //     .then(res => this.setState({games: res.data}))
  //     .catch(e => console.log(e));
  // }

  gamesList()
  {
    const { games } = this.state;
    return games.map(currentGame => {
      return <ItemCard game={currentGame} />
    })
  }

  render(){
    return(
      <div>
        <div class="input-group rounded">
          <input type="search" class="form-control rounded" placeholder="Search" value={this.state.searchKeyword} onChange={(e) => {this.handleInputChange(e.target.value)}} aria-label="Search" aria-describedby="search-addon" />
          <span class="input-group-text border-0" id="search-addon">
            <i class="fas fa-search"></i>
          </span>
        </div>
        <div class="row row-cols-5">
        {this.gamesList()}
      </div>
      </div>
    )
  }
}