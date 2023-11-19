import React, { useState, useRef } from 'react';
import axios from 'axios';

function GameUploadForm() {
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    downloadFile: null,
    displayImage: null,
    additionalImages: [],
    price: 0,
    ownerId: 0,
    collaboratorsIds: [],
    uploadDate: '',
    publishDate: '',
    tags: [],
    genre: '',
    supportedPlatforms: [],
    additionalTechnicalDescription: '',
    status: '',
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
    formData.append('collaboratorsIds', gameData.collaboratorsIds);
    formData.append('uploadDate', gameData.uploadDate);
    formData.append('publishDate', gameData.publishDate);
    formData.append('tags', gameData.tags);
    formData.append('genre', gameData.genre);
    formData.append('supportedPlatforms', gameData.supportedPlatforms);
    formData.append(
      'additionalTechnicalDescription',
      gameData.additionalTechnicalDescription
    );
    formData.append('status', gameData.status);

    // Send formData to server
    try {
      const response = await axios.post(
        'http://localhost:8081/api/games',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    setGameData({
      name: '',
      description: '',
      downloadFile: null,
      displayImage: null,
      additionalImages: [],
      price: 0,
      ownerId: 0,
      collaboratorsIds: [],
      uploadDate: '',
      publishDate: '',
      tags: [],
      genre: '',
      supportedPlatforms: [],
      additionalTechnicalDescription: '',
      status: '',
    });
    downloadFileRef.current.value = null;
    displayImageRef.current.value = null;
    additionalImagesRef.current.value = [];
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="container"
    >
      <div className="form-group">
        <label htmlFor="name">Game Name</label>
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
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={gameData.description}
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="downloadFile">Download File</label>
        <input
          type="file"
          className="form-control-file"
          id="downloadFile"
          name="downloadFile"
          onChange={handleFileChange}
          ref={downloadFileRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="displayImage">Display Image</label>
        <input
          type="file"
          className="form-control-file"
          id="displayImage"
          name="displayImage"
          onChange={handleFileChange}
          ref={displayImageRef}

        />
      </div>

      <div className="form-group">
        <label htmlFor="additionalImages">Additional Images</label>
        <input
          type="file"
          className="form-control-file"
          id="additionalImages"
          name="additionalImages"
          multiple
          onChange={handleFileChange}
          ref={additionalImagesRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
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
        <label htmlFor="ownerId">Owner ID</label>
        <input
          type="number"
          className="form-control"
          id="ownerId"
          name="ownerId"
          value={gameData.ownerId}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="collaboratorsIds">
          Collaborators IDs (comma-separated)
        </label>
        <input
          type="text"
          className="form-control"
          id="collaboratorsIds"
          name="collaboratorsIds"
          value={gameData.collaboratorsIds}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="uploadDate">Upload Date</label>
        <input
          type="date"
          className="form-control"
          id="uploadDate"
          name="uploadDate"
          value={gameData.uploadDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="publishDate">Publish Date</label>
        <input
          type="date"
          className="form-control"
          id="publishDate"
          name="publishDate"
          value={gameData.publishDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
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
        <label htmlFor="genre">Genre</label>
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
        <label htmlFor="supportedPlatforms">
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
        <label htmlFor="additionalTechnicalDescription">
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

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <input
          type="text"
          className="form-control"
          id="status"
          name="status"
          value={gameData.status}
          onChange={handleInputChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Upload Game
      </button>
    </form>
  );
}

export default GameUploadForm;
