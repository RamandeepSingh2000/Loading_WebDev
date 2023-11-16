import React, {Component} from "react";
import ItemCard from "./itemcard.component";
import axios from "axios";

export default class GamesGrid extends Component{
  constructor(props){
    super(props)
    this.state = {games: []}
  }

  componentDidMount(){
      
      axios.get('http://localhost:8081/api/games')
      .then(res => this.setState({games: res.data}))
      .catch(e => console.log(e));
  }

  componentDidUpdate(){
      axios.get('http://localhost:8081/api/games')
      .then(res => this.setState({games: res.data}))
      .catch(e => console.log(e));
  }

  gamesList()
  {
      return this.state.games.map(function(currentGame, i){
          return <ItemCard game={currentGame} key={i} />
      })
  }

  render(){
    return(
      <div class="vagetables_section layout_padding margin_bottom90">
      <div class="courses_section_2">
        {this.gamesList()}
        {/* <div class="row">
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
        </div>
        <div class="row">
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
        </div>
        <div class="row">
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
        </div> */}
      </div>
      </div>
    )
  }
}