import { useRete } from "../services/edit-service/custom-rete";
import "../App.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import authHeader from "../services/auth-header";
import React, { useState } from "react";
import {
  Button,
  Col,
  Modal,
  Offcanvas,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";

function EditorPage() {
  const props = useRete();
  const contents = props.contents;
  const setContainer = props.setContainer;

  const [loadShow, setLoadShow] = useState(false);
  const [saveShow, setSaveShow] = useState(false);
  const [saveSuccessShow, setSuccessShow] = useState(false);

  const handleLoadClose = () => setLoadShow(false);
  const handleLoadShow = () => setLoadShow(true);

  const handleSaveClose = () => setSaveShow(false);
  const handleSaveShow = () => setSaveShow(true);

  const handleClickSaveButton = () => {
    handleSaveClose();
    if (contents && contents.current) {
      const jsonData = JSON.stringify(contents.current.toJSON());
      const blobJsonData = new Blob([jsonData], { type: "application/json" });
      const psotData = new FormData();
      psotData.append("macro", blobJsonData);
      axios
        .post(process.env.REACT_APP_PRIVATE_API_URL + "/setmacro", psotData, {
          headers: authHeader(),
        })
        .then((response: AxiosResponse) => {
          if (response) {
            setSuccessShow(true);
          } else {
            alert("An unexpected error has occurred.");
          }
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.status === 401) {
            alert("Failed to save the nodes.");
          } else {
            console.log(error.response);
            alert("An unexpected error has occurred.");
          }
        });
    } else {
      alert("Failed to save the nodes.");
    }
  };

  const handleClickLoadButton = async () => {
    handleLoadClose();
    axios
      .get(process.env.REACT_APP_PRIVATE_API_URL + "/getmacro", {
        headers: authHeader(),
      })
      .then((response: AxiosResponse) => {
        if (response.data && contents && contents.current) {
          contents.current.fromJSON(response.data);
          setSuccessShow(true);
        } else {
          alert("An unexpected error has occurred.");
        }
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          alert("Failed to load the nodes.");
        } else {
          alert("An unexpected error has occurred.");
        }
      });
  };
  return (
    <>
      <ToastContainer position="top-center">
        <Toast
          onClose={() => setSuccessShow(false)}
          show={saveSuccessShow}
          bg="success"
          delay={3000}
          autohide
        >
          <Toast.Body>Success</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal show={saveShow} onHide={handleSaveClose}>
        <Modal.Header closeButton>
          <Modal.Title>Node Saving</Modal.Title>
        </Modal.Header>
        <Modal.Body>Saving overwrites the currently saved contents.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClickSaveButton}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={loadShow} onHide={handleLoadClose}>
        <Modal.Header closeButton>
          <Modal.Title>Node Loading</Modal.Title>
        </Modal.Header>
        <Modal.Body>The current canvas is deleted when loaded.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoadClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClickLoadButton}>
            Load
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="Editor-wrapper">
        <div className="editor">
          <div className="container">
            <div className="node-editor"></div>
          </div>
          <div className="dock"></div>
        </div>
        <div className="Editor-save-load">
          <button onClick={handleSaveShow}>save</button>
          <button onClick={handleLoadShow}>load</button>
        </div>
        <div
          className="Editor-Playfield"
          ref={(ref) => ref && setContainer(ref)}
        />
      </div>
    </>
  );
}

export default EditorPage;
