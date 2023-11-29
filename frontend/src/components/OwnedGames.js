import React, { useState, useEffect } from 'react';

const OwnedGames = () => {
  const [games, setGames] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    // Fetch user's purchased game data from the backend 
    fetch('backend api endpoint')
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching game data:', error));
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  const filteredGames = selectedTag
    ? games.filter((game) => game.tags.includes(selectedTag))
    : games;

  return (
    <div>
      <h2>Owned Games</h2>
      <div>
        <label>Filter by Tag:</label>
        <select onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">All</option>
          <option value="horror">Horror</option>
          <option value="unity">Unity</option>
          <option value="multiplayer">Multiplayer</option>
        </select>
      </div>
      <div>
        {filteredGames.map((game, index) => (
          <div key={index}>
            <h3>{game.title}</h3>
            <p>Tags: {game.tags.join(', ')}</p>
            <p>Genre: {game.genre}</p>
            <p>Supported Platforms: {game.supportedPlatforms.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnedGames;
