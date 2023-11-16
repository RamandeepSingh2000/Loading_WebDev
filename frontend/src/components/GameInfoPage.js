import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Helper function to convert the string to Uint8Array
const getImageFromBinary = data => {
  return URL.createObjectURL(new Blob([new Uint8Array(data)], { type: "image/png" }))
}
// State to holf info
const GameInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gameInfo, setGameInfo] = useState({
    name: '',
    description: '',
    downloadFile: null,
    displayImage: null,
    additionalImages: [],
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
        const response = await axios.get(`http://localhost:8081/api/games/${id}`); // Replace with your actual endpoint
        const data = response.data;
        // Convert date strings to Date objects
      data.uploadDate = new Date(data.uploadDate);
      data.publishDate = new Date(data.publishDate);
      data.displayImage = data.displayImage == null ? null : getImageFromBinary(data.displayImage.data);
      data.downloadFile = data.downloadFile == null ? null : getImageFromBinary(data.downloadFile.data);
      data.additionalImages = await Promise.all(        
        data.additionalImages.map(async image => {
          return image == null ? null : getImageFromBinary(image.data); //for testing
        })
      );

        setGameInfo(data);
      } catch (error) {
        console.error('Error fetching game information', error);
      }
    };

    fetchGameInfo();
  }, [id]);

  const handleDownload = (downloadLink) => {
    const downloadLinkElement = document.createElement('a');
    downloadLinkElement.href = downloadLink
    downloadLinkElement.download = 'download.png';  // Set the desired file name
    downloadLinkElement.click();
    //window.open(gameInfo.downloadFile, '_blank');
  };

  const handleDelete = async (id) => {  
    try {
      await axios.delete(`http://localhost:8081/api/games/${id}`); // Replace with your actual endpoint
      
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
      <img src={gameInfo.displayImage} style={{ maxWidth: "150px", height: "auto" }} alt="Display" />
      {gameInfo.additionalImages && (
        <div>
          {gameInfo.additionalImages.map((image, index) => (
            <img key={index} src={image} style={{ maxWidth: "150px", height: "auto" }} alt={`Additional ${index + 1}`}  />
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
      <button onClick={() => handleDownload(gameInfo.downloadFile)}>Download Game</button>
      <button onClick={() => handleDelete(id)}>Delete Game</button>
      <Link to={`/game-edit/${id}`}>Edit Game</Link>
    </div>
  );
};

export default GameInfoPage;
