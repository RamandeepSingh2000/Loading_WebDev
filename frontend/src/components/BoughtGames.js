import React, { useState, useEffect } from 'react';

const BoughtGames = () => {
  const [games, setGames] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    mode: 'All',
    platform: 'All',
  });

  useEffect(() => {
   // Fetch user's purchased game data from the backend 
   fetch('backend api endpoint')
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch((error) => console.error('Error fetching game data:', error));
  }, []);

  const filteredGames = games.filter((game) => {
    const modeCondition =
      filterOptions.mode === 'All' ||
      (filterOptions.mode === 'Both' &&
        game.mode === 'SinglePlayer' &&
        game.tags.includes('Multiplayer')) ||
      game.mode === filterOptions.mode;

    const platformCondition =
      filterOptions.platform === 'All' ||
      (filterOptions.platform === 'Both' &&
        game.supportedPlatforms.includes('Windows') &&
        game.supportedPlatforms.includes('Mac')) ||
      game.supportedPlatforms.includes(filterOptions.platform);

    return modeCondition && platformCondition;
  });

  return (
    <div>
      <h2>Bought Games</h2>
      <div>
        <label>Filter by Mode:</label>
        <select
          onChange={(e) =>
            setFilterOptions({ ...filterOptions, mode: e.target.value })
          }
        >
          <option value="All">All</option>
          <option value="SinglePlayer">Single Player</option>
          <option value="Multiplayer">Multiplayer</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        <label>Filter by Platform:</label>
        <select
          onChange={(e) =>
            setFilterOptions({ ...filterOptions, platform: e.target.value })
          }
        >
          <option value="All">All</option>
          <option value="Windows">Windows</option>
          <option value="Mac">Mac</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div>
        {filteredGames.map((game, index) => (
          <div key={index}>
            <h3>{game.name}</h3>
            <p>ID: {game.id}</p>
            <p>Tags: {game.tags.join(', ')}</p>
            <p>Mode: {game.mode}</p>
            <p>Supported Platforms: {game.supportedPlatforms.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoughtGames;
