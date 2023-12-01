import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const helper = require('../helper');
// State to holf info
const GameInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameInfo, setGameInfo] = useState({
    name: '',
    description: '',
    downloadFileURL: null,
    displayImageURL: null,
    additionalImagesURLs: [],
    price: 0,
    ownerId: 0,
    uploadDate: new Date(),
    publishDate: new Date(),
    tags: [],
    genre: '',
    supportedPlatforms: [],
    status: '',
  });

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/games/${id}`); // Replace with your actual endpoint
        const data = response.data;
        // Convert date strings to Date objects
        data.uploadDate = new Date(data.uploadDate);
        data.publishDate = new Date(data.publishDate);

        setGameInfo(data);
      } catch (error) {
        console.error('Error fetching game information', error);
      }
    };

    fetchGameInfo();
  }, [id]);

  const handleDownload = async (downloadLink) => {
    try {
      const response = await fetch(downloadLink);
      const blob = await response.blob();
  
      const downloadLinkElement = document.createElement('a');
      const objectURL = URL.createObjectURL(blob);
  
      downloadLinkElement.href = objectURL;
      downloadLinkElement.download = 'download.png'; // Set the desired file name
      downloadLinkElement.click();
  
      // Clean up the object URL after the download link has been clicked
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleDelete = async (id) => {  
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:8081/api/games/${id}`, config);
    }
    catch (error) {
      console.error('Error fetching game information', error);
    }
    navigate("/");
  }
  return (
    <div>
      <p>{gameInfo.name}</p>
      <p>{gameInfo.description}</p>
      <img src={gameInfo.displayImageURL} style={{ maxWidth: "150px", height: "auto" }} alt="Display" />
      {gameInfo.additionalImagesURLs && (
        <div>
          {gameInfo.additionalImagesURLs.map((imageURL, index) => (
            <img key={index} src={imageURL} style={{ maxWidth: "150px", height: "auto" }} alt={`Additional ${index + 1}`}  />
          ))}
        </div>
      )}
      <p>Price: ${gameInfo.price}</p>
      <p>Tags: {gameInfo.tags.join(', ')}</p>
      <p>Genre: {gameInfo.genre}</p>
      <p>Supported Platforms: {gameInfo.supportedPlatforms}</p>
      <p>Status: {gameInfo.status}</p>
      <p>Upload Date: {gameInfo.uploadDate.toDateString()}</p>
      <p>Publish Date: {gameInfo.publishDate.toDateString()}</p>
      <p>Owner ID: {gameInfo.ownerId}</p>
      {
        gameInfo.ownerId == helper.getUserId() && (
          
          <div>
            <button onClick={() => handleDelete(id)}>Delete Game</button>
            <Link to={`/game-edit/${id}`}>Edit Game</Link>
          </div>          
          )
      }
      <button onClick={() => handleDownload(gameInfo.downloadFileURL)}>Download Game</button>      
    </div>
  );
};

export default GameInfoPage;
