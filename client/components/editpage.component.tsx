import { useRete } from "../services/edit-service/custom-rete";
import "../App.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import authHeader from "../services/auth-header";
import { useState } from "react";
import { Button, Modal, Toast, ToastContainer } from "react-bootstrap";

const saveNotificationTexts = {
  title: "Node Saving",
  body: "Saving overwrites the currently saved contents.",
  secondaryButton: "Close",
  primaryButton: "Save",
}
const loadNotificationTexts = {
  title: "Node Loading",
  body: "The current canvas is deleted when loaded.",
  secondaryButton: "Close",
  primaryButton: "Load",
}

function EditorPage() {
  const props = useRete();
  const contents = props.contents;
  const setContainer = props.setContainer;

  const [notificationShow, setNotificationShow] = useState(false);
  const [saveSuccessShow, setSuccessShow] = useState(false);
  const [notificationTexts, setNotificationTexts] = useState({
    title: "",
    body: "",
    secondaryButton: "",
    primaryButton: "",
  });
  const [notificationHandleFlag, setNotificationHandleFlag] = useState(false);

  const NotificationModel = () => {
    return (
      <Modal show={notificationShow} onHide={handleCloseNotification}>
      <Modal.Header closeButton>
        <Modal.Title>{notificationTexts.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{notificationTexts.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseNotification}>
          {notificationTexts.secondaryButton}
        </Button>
        <Button
          variant="primary"
          onClick={notificationHandleFlag
              ? handleClickSaveButton
              : handleClickLoadButton
          }
        >
          {notificationTexts.primaryButton}
        </Button>
      </Modal.Footer>
    </Modal>
    );
  }

  const handleCloseNotification = () => setNotificationShow(false);
  const handleShowNotification = (
    {
      title,
      body,
      secondaryButton,
      primaryButton,
    }: {
      title: string;
      body: string;
      secondaryButton: string;
      primaryButton: string;
    },
    hanldeFlag: boolean) => {
    setNotificationShow(true);
    setNotificationTexts({
      title: title,
      body: body,
      secondaryButton: secondaryButton,
      primaryButton: primaryButton,
    });
    setNotificationHandleFlag(hanldeFlag);
  };

  const handleClickSaveButton = () => {
    handleCloseNotification();
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
    handleCloseNotification();
    axios
      .get(process.env.REACT_APP_PRIVATE_API_URL + "/getmacro", {
        headers: authHeader(),
      })
      .then((response: AxiosResponse) => {
        if (response.data && contents && contents.current) {
          console.log(response.data);
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
      <NotificationModel />
      <div className="Editor-wrapper">
        <div className="editor">
          <div className="container">
            <div className="node-editor"></div>
          </div>
          <div className="dock"></div>
        </div>
        <div className="Editor-save-load">
          <button onClick={()=>handleShowNotification(saveNotificationTexts,true)}>save</button>
          <button onClick={()=>handleShowNotification(loadNotificationTexts, false)}>load</button>
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
