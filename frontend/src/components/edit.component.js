import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const helper = require('../helper');

function GameEditPage() {
  const {id} = useParams();
  const [errorMessages, setErrorMessages] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    downloadFile: null,
    displayImage: null,
    additionalImages: [],
    price: 0,
    ownerId: 0,
    tags: [],
    genre: '',
    supportedPlatforms: [],
    additionalTechnicalDescription: ''
  });

  const displayImageRef = useRef(null);
  const additionalImagesRef = useRef([]);
  const downloadFileRef = useRef(null);

  const handleInputChange = (e) => {
    setGameData({ ...gameData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'additionalImages') {
      setGameData({ ...gameData, additionalImages: [...e.target.files] });
    } else {
      setGameData({ ...gameData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(uploadInProgress){
      return;
    }

    setUploadInProgress(true);
    setUploadMessage("You game is being updated....");

    let formData = new FormData();

    // Append file inputs to formData
    if (gameData.downloadFile) {
      formData.append('downloadFile', gameData.downloadFile);
    }
    if (gameData.displayImage) {
      formData.append('displayImage', gameData.displayImage);
    }

    // For multiple files, append each file under the same key
    if (gameData.additionalImages && gameData.additionalImages.length > 0) {
      gameData.additionalImages.forEach((file) =>
        formData.append('additionalImages', file)
      );
    }

    formData.append('name', gameData.name);
    formData.append('description', gameData.description);
    formData.append('price', gameData.price);
    formData.append('ownerId', gameData.ownerId);
    formData.append('tags', gameData.tags);
    formData.append('genre', gameData.genre);
    formData.append('supportedPlatforms', gameData.supportedPlatforms);
    formData.append(
      'additionalTechnicalDescription',
      gameData.additionalTechnicalDescription
    );

    // Send formData to server
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/games/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${helper.getAuthToken()}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      const errors = [];
      const checkErrors = error.response.data.checkErrors;
      if(checkErrors){
        checkErrors.forEach(err => {
          errors.push(err.msg);
        })
      }
      if(error.response.data.Error){
        errors.push(error.response.data.Error);
      }     
      setErrorMessages(errors);
      setUploadInProgress(false);
        setUploadMessage(null);
      return;
    }

    setGameData({
      name: '',
      description: '',
      downloadFile: null,
      displayImage: null,
      additionalImages: [],
      price: 0,
      ownerId: 0,
      tags: [],
      genre: '',
      supportedPlatforms: [],
      additionalTechnicalDescription: ''
    });
    setErrorMessages([]);
    downloadFileRef.current.value = null;
    displayImageRef.current.value = null;
    additionalImagesRef.current.value = [];
    setUploadInProgress(false);
    setUploadMessage("Your game is successfully updated. You can make more changes if you like.")
  };
  const handleDescriptionGeneration = async (e) => {
    try{
      if(generatingDescription){
        return;
      }
      setGeneratingDescription(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/ai/generategamedesc`,
        {
          params:{
            userDesc: gameData.description
          }
        }    
      );

      setGameData({...gameData, description: response.data.description});
      setErrorMessages([]);
    }
    catch(error){
      const errors = errorMessages.slice();
      if(error.response.data.error){
        if(!errors.includes(error.response.data.error)){
          errors.push(error.response.data.error);
          setErrorMessages(errors);
          console.log(errors);
        }        
      }      
    }

    setGeneratingDescription(false);
  }

    return (
      <div>
      <p style={{fontWeight: 'bold'}}>Edit Game</p>  
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="container"
        style={{textAlign: 'left'}}
      >
        {
          errorMessages.length > 0 && (          
                errorMessages.map((error, key) => {
                  return(
                    <div className='row'>
                    <p class="text-danger" key={key}>{error}</p></div>);
                })   
            )
        }
        {
        (uploadMessage != null) && (
          <p class="text-success">{uploadMessage}</p>
          )
      }
        <div className='row'>
          <div className='col'>
              <div className="form-group">
              <label htmlFor="name" style={{fontWeight: 'bold'}}>Game Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={gameData.name}
                onChange={handleInputChange}
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="description" style={{fontWeight: 'bold'}}>Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="5"
                value={gameData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          {
            !generatingDescription ? (
              <button type="button" onClick={handleDescriptionGeneration} class="btn btn-dark">Improve Description</button>
              ) : (
                <p class="text-success">Generating description...</p>
                )
          }            
          </div>
            <div className="form-group">
          <label htmlFor="price" style={{fontWeight: 'bold'}}>Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={gameData.price}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="tags" style={{fontWeight: 'bold'}}>Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={gameData.tags}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="genre" style={{fontWeight: 'bold'}}>Genre</label>
          <input
            type="text"
            className="form-control"
            id="genre"
            name="genre"
            value={gameData.genre}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="supportedPlatforms" style={{fontWeight: 'bold'}}>
            Supported Platforms (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            id="supportedPlatforms"
            name="supportedPlatforms"
            value={gameData.supportedPlatforms}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="additionalTechnicalDescription" style={{fontWeight: 'bold'}}>
            Additional Technical Description
          </label>
          <textarea
            className="form-control"
            id="additionalTechnicalDescription"
            name="additionalTechnicalDescription"
            value={gameData.additionalTechnicalDescription}
            onChange={handleInputChange}
          ></textarea>
        </div>
          </div>
          <div className='col'>
          <div class="mb-3">
          <label for="downloadFile" class="form-label" style={{fontWeight: 'bold'}}>Download File</label>
          <input 
          className="form-control" 
          type="file" 
          id="downloadFile"
          name="downloadFile"
            onChange={handleFileChange}
            ref={downloadFileRef} />
        </div>
        <div class="mb-3">
          <label for="displayImage" class="form-label" style={{fontWeight: 'bold'}}>Display Image</label>
          <input 
          className="form-control" 
          type="file" 
          id="displayImage"
          name="displayImage"
            onChange={handleFileChange}
            ref={displayImageRef} />
        </div>
        <div class="mb-3">
          <label for="additionalImages" class="form-label" style={{fontWeight: 'bold'}}>Additional Images</label>
          <input class="form-control" type="file" 
          id="additionalImages"
          name="additionalImages"
          multiple
          onChange={handleFileChange}
          ref={additionalImagesRef}/>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Game
        </button>
          </div>
        </div>
      </form>
      </div>
    );
}

export default GameEditPage;
