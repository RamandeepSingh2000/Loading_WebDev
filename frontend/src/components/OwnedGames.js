import React, { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import ItemCard from "./itemcard.component";
const OwnedGames = () => {
  const [games, setGames] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/games/owned/${id}`)
    .then((res) => setGames(res.data))
    .catch((error) => console.error('Error fetching game data:', error));
  }, []); 

  return (
    <div>
      <p>Owned Games</p>
        <div class="row row-cols-5">
        {games.map((game, index) => (
              <ItemCard game={game} key={index}/>
        ))}         
    </div>
    </div>
  );
};

export default OwnedGames;
