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
    //downloadFileURL: null,
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
    purchased: null
  });

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        let response = null;
        if(!helper.isLoggedIn()){
          response = await axios.get(`http://localhost:8081/api/games/${id}`);
        }
        else{
          const token = localStorage.getItem('jwtToken');
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          response = await axios.get(`http://localhost:8081/api/user/games/${id}`, config);
        }
         // Replace with your actual endpoint
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

  const handleDownload = async (gameInfo) => {
    try {

      let gameDownloadURL = null;
      if(gameInfo.price == 0){
        const response = await axios.get(`http://localhost:8081/api/games/download/free/${id}`);
        gameDownloadURL = response.data;//get link from server;
      }
      else{
        if(!helper.isLoggedIn()){
          navigate('/login');
          return;
        }
        else{

          if(helper.isUserAdmin() || gameInfo.ownerId == helper.getUserId()){
            const token = localStorage.getItem('jwtToken');
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const response = await axios.get(`http://localhost:8081/api/games/download/${id}`, config);
            gameDownloadURL = response.data; //get link from server;
          }
          else{
            if(gameInfo.purchased){
              const token = localStorage.getItem('jwtToken');
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              const response = await axios.get(`http://localhost:8081/api/games/download/${id}`, config);
              gameDownloadURL = response.data; //get link from server;
            }
            else{
              const token = localStorage.getItem('jwtToken');
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
              const response = await axios.post(`http://localhost:8081/api/games/purchase/${id}`, null, config);
              window.location = response.data;
              return;
            }
          }

          
        }
      }
      
      const response = await fetch(gameDownloadURL);
      const blob = await response.blob();
  
      const downloadLinkElement = document.createElement('a');
      const objectURL = URL.createObjectURL(blob);
  
      downloadLinkElement.href = objectURL;
      downloadLinkElement.download = 'download.zip'; // Set the desired file name
      downloadLinkElement.click();
  
      // Clean up the object URL after the download link has been clicked
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e) => {  
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
  const handleReview = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`http://localhost:8081/api/games/adminreview/${id}/${newStatus}`, null, config);
    }
    catch (error) {
      console.error(error);
    }

    navigate("/admin");
  }
  return (
    <div>
      <div className='container'>
      <div className='row'>
        <div className='col-2'>
          {gameInfo.additionalImagesURLs && (        
              gameInfo.additionalImagesURLs.map((imageURL, index) => (
                <div className='row'>
                <img className='img-thumbnail' key={index} src={imageURL} style={{ maxWidth: "150px", height: "auto" }} alt={`Additional ${index + 1}`}  />
                </div>
              ))      
          )}  
          </div>   
          <div className='col-5'>
          <img src={gameInfo.displayImageURL} className='rounded float-start' style={{ width: 100 + "%", height: "auto" }} alt="Display" /> 
          </div>
          <div className='col-5' style={{textAlign: 'left'}}>
          <p style={{fontWeight: 'bold'}}>{gameInfo.name}</p>
      <p>{gameInfo.description}</p>
      <p>Genre: {gameInfo.genre}</p>      
      <p>Tags: {gameInfo.tags.join(', ')}</p>      
      <p>Supported Platforms: {gameInfo.supportedPlatforms}</p>      
      <p>Upload Date: {gameInfo.uploadDate.toDateString()}</p>
      <p>Publish Date: {gameInfo.publishDate.toDateString()}</p>
      <p>Status: {gameInfo.status}</p>
      <p>Price: ${gameInfo.price}</p>
      <div className='container'>
        <div className='row'>
        <div className='col'>
          <button className='btn btn-dark' onClick={() => handleDownload(gameInfo)}>
          {
            (gameInfo.purchased == null || (gameInfo.price == 0) || gameInfo.purchased == true || helper.isUserAdmin() || gameInfo.ownerId == helper.getUserId()) ? "Download Game" : "Purchase Game"
          }
          </button>
        </div>  
        {
          (helper.isLoggedIn() && helper.isUserAdmin()) && (
            <div className='col'>
              <div className='row'>
            <div className='col'>
              <button className='btn btn-success' onClick={() => handleReview(id, "Published")}>Approve</button>
              </div>
              <div className='col'>
              <button className='btn btn-danger' onClick={() => handleReview(id, "Blocked")}>Deny</button>
              </div>
              </div>
              </div>
            )
        }   
        {
          gameInfo.ownerId == helper.getUserId() && (
            
            <div className='col'>
              <button className='btn btn-danger' onClick={handleDelete}>Delete Game</button>
              <Link className='btn btn-secondary' to={`/game-edit/${id}`}>Edit Game</Link>
            </div>          
            )
        }
        </div>
      </div>
      
          </div>
      </div>         
      </div> 
      
        
           
        
    </div>
  );
};

export default GameInfoPage;
