import React, {Component} from "react";
import ItemCard from "./itemcard.component";
import axios from "axios";

export default class GamesGrid extends Component{
  constructor(props){
    super(props)
    this.state = {games: []}
  }

  componentDidMount(){
      
      axios.get('http://localhost:8081/api/games?numberOfGames=20')
      .then(res => this.setState({games: res.data}))
      .catch(e => console.log(e));
  }

  // //not sure if it should be done like this. making an api request every update.
  // componentDidUpdate(){
  //     axios.get('http://localhost:8081/api/games?numberOfGames=20')
  //     .then(res => this.setState({games: res.data}))
  //     .catch(e => console.log(e));
  // }

  gamesList()
  {
    const { games } = this.state;
    const cardsPerRow = 5;
  
    const rows = [];
    for (let i = 0; i < games.length; i += cardsPerRow) {
      const row = games.slice(i, i + cardsPerRow).map((currentGame, index) => (
        <div className="col-md-2" key={i + index}>
          <ItemCard game={currentGame} />
        </div>
      ));
      rows.push(<div className="row" key={i}>{row}</div>);
    }
  
    return rows;
  }

  render(){
    return(
      <div class="vagetables_section layout_padding margin_bottom90">
      <div class="courses_section_2">
        {this.gamesList()}
      </div>
      </div>
    )
  }
}