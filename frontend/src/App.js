import React, { useRef, useState, useEffect, useCallback } from "react";

import { Button, Header, Modal, Icon } from "semantic-ui-react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
} from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";

import AnswersList from "./components/AnswersList";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [openDimmer, setOpenDimmer] = useState(false);

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
      console.log(pickedFile);
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
        setAnswers(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(isDragActive);

    console.log(acceptedFiles[0]);
    if (!file) {
      setFile(acceptedFiles[0]);
      return;
    }
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    noClick: true,
    onDrop,
  });

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <div className="App">
            <div {...getRootProps({ className: "dropzone" })}>
              <h1>Easy Solutions </h1>
              {/* image input */}
              <input
                type="file"
                ref={filePickerRef}
                style={{ display: "none" }}
                accept=".jpg, .png, .jpeg"
                onChange={pickedHandler}
              />
              <input {...getInputProps()} />
              {/* image preview */}
              <div className="image-upload">
                <div className="image-preview">
                  {previewUrl && <img src={previewUrl} alt="preview" />}
                  {!previewUrl && <p>Please Pick an Image</p>}
                </div>
                <Button animated="vertical" onClick={pickImageHandlder}>
                  <Button.Content hidden>
                    <Icon name="file image outline" />
                  </Button.Content>
                  <Button.Content visible>Pick Image</Button.Content>
                </Button>
              </div>
              <div className="checking-Drop">
                {isDragActive ? (
                  /* <Modal
                  basic
                  onClose={() => setOpenDimmer(false)}
                  onOpen={() => setOpenDimmer(true)}
                  open={true}
                  size="small"
                  // trigger={<Button>Basic Modal</Button>}
                  className="modal"
                >
                  <Header className="modalHeader">Drop it like it's hot</Header>
                </Modal> */
                  <p>DROP IT LIKE IT'S HOT</p>
                ) : (
                  <p>or drop images here</p>
                )}
              </div>

              {file && (
                <button className="uploadBtn" onClick={sendFileHandler}>
                  Upload
                </button>
              )}
              <div className="questions">
                {questions &&
                  questions.map((ques, i) => (
                    <p key={i}>{`Q${i + 1 + ")"} ${"" + ques}`}</p>
                  ))}
              </div>
              {questions.length !== 0 ? (
                <button onClick={getAnswers}>Proceed</button>
              ) : (
                ""
              )}
              {answers.length !== 0 && (
                <Link to="/answers">
                  <button className="answersBtn">View answers</button>{" "}
                </Link>
              )}
            </div>
          </div>
        </Route>
        <Route path="/answers" exact>
          <AnswersList answers={answers} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
