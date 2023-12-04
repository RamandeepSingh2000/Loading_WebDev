import React, { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ItemCard from "./itemcard.component";
const PurchasedGames = () => {
  const [games, setGames] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:8081/api/games/purchased/${id}`)
    .then((res) => setGames(res.data))
    .catch((error) => console.error('Error fetching game data:', error));
  }, []); 

  return (
    <div>
      <p>Purchased Games</p>
      <div class="row row-cols-5">
        {games.map((game, index) => (
              <ItemCard game={game} key={index}/>
        ))}         
    </div>
    </div>
  );
};

export default PurchasedGames;