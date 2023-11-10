import React, { useState } from 'react';

function UploadPage() {
  const [fileName, setFileName] = useState('Choose file'); // State to store the file name

  // Event handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'Choose file');
  };

  return (
    <div className="container-fluid m-4 p-4">
      <form className="p-4">
        <div className="form-group p-2">
          <label className="text-start" htmlFor="game-title">
            Game Title
          </label>
          <input
            type="text"
            className="form-control"
            id="game-title"
            placeholder="Enter Game Title"
          />
        </div>
        <div className="form-group p-2">
          <label className="text-start" htmlFor="game-description">
            Game Description
          </label>
          <input
            type="text"
            className="form-control"
            id="game-description"
            placeholder="Enter Game Description"
          />
        </div>

        <div className="form-group p-2">
          <label htmlFor="exampleFormControlFile1" className="d-block">
            Example file input
          </label>
          <input
            type="file"
            className="form-control-file d-block"
            id="exampleFormControlFile1"
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadPage;
