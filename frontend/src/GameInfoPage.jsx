import React, { useState, useEffect } from 'react';

// State to holf info
const GameInfoPage = () => {
  const [gameInfo, setGameInfo] = useState({
    name: '',
    description: '',
    downloadFileURL: '',
    displayImageURL: '',
    additionalImagesURL: '',
    price: 0,
    ownerId: 0,
    collaboratorsIds: [],
    uploadDate: new Date(),
    publishDate: new Date(),
    tags: '',
    genre: '',
    supportedPlatforms: '',
    status: '',
  });

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
      
        const response = await fetch('The Backend Endpoint');
        const data = await response.json();
        setGameInfo(data);
      } catch (error) {
        console.error('Error fetching game information', error);
      }
    };

    fetchGameInfo();
  }, []);

  const handleDownload = () => {
    window.open(gameInfo.downloadFileURL, '_blank');
  };

  return (
    <div className='flex'>
      <h1>{gameInfo.name}</h1>
      <p>{gameInfo.description}</p>
      <img src={gameInfo.displayImageURL} alt="Display" />
      {gameInfo.additionalImagesURL && (
        <div>
          {gameInfo.additionalImagesURL.split(',').map((image, index) => (
            <img key={index} src={image} alt={`Additional ${index + 1}`} />
          ))}
        </div>
      )}
      <p>Price: ${gameInfo.price}</p>
      <p>Tags: {gameInfo.tags}</p>
      <p>Genre: {gameInfo.genre}</p>
      <p>Supported Platforms: {gameInfo.supportedPlatforms}</p>
      <p>Status: {gameInfo.status}</p>
      <p>Upload Date: {gameInfo.uploadDate.toDateString()}</p>
      <p>Publish Date: {gameInfo.publishDate.toDateString()}</p>
      <p>Owner ID: {gameInfo.ownerId}</p>
      <p>Collaborators IDs: {gameInfo.collaboratorsIds.join(', ')}</p>
      <button onClick={handleDownload}>Download Game</button>
    </div>
  );
};

export default GameInfoPage;
