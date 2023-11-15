import React, {Component} from "react";
import ItemCard from "./itemcard.component";

export default class GamesGrid extends Component{
  constructor(props){
    super(props)

  }
  render(){
    return(
      <div class="vagetables_section layout_padding margin_bottom90">
      <div class="courses_section_2">
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
        </div>
        <div class="row">
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
          <ItemCard/>
        </div>
      </div>
      </div>
    )
  }
}