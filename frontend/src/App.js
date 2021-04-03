import React, { useRef, useState, useEffect } from "react";

import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [questions, setQuestions] = useState([]);
  // for connection between button and input field
  const filePickerRef = useRef();

  //for preview
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  //sets file
  const pickedHandler = (e) => {
    if (e.target.files && e.target.files.length === 1) {
      const pickedFile = e.target.files[0];
      setFile(pickedFile);
      // return;
    }
    return;
  };

  // connection between pick image btn and input field
  const pickImageHandlder = () => {
    filePickerRef.current.click();
  };

  const sendFileHandler = () => {
    const fd = new FormData();
    fd.append("image", file, file.name);
    axios
      .post("http://localhost:5000/", fd)
      .then((res) => {
        console.log(res.data);
        if (res) {
          setQuestions(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAnswers = async () => {
    await axios
      .get("http://127.0.0.1:5000/answers")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <h1>Hello React </h1>
      {/* image input */}
      <input
        type="file"
        ref={filePickerRef}
        style={{ display: "none" }}
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      {/* image preview */}
      <div className="image-upload">
        <div className="image-preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>Please Pick an Image</p>}
        </div>
        <button type="button" onClick={pickImageHandlder}>
          Pick Image
        </button>
      </div>
      <button onClick={sendFileHandler}>Upload</button>
      {questions && questions.map((ques, i) => <p key={i}>{ques}</p>)}
      {questions ? <button onClick={getAnswers}>Proceed</button> : ""}
    </div>
  );
}

export default App;
