import React from "react";
import { useRete } from "../services/edit-service/custom-rete";
import '../App.css';
import AreaPlugin from "rete-area-plugin";

function EditorPage() {
  const [container, setContainer] = useRete();
  const handleClickSaveButton = () => {
    localStorage.setItem('GRAPH_EDITOR_VIEW', JSON.stringify(container.current.toJSON()));
  }
  const handleClickLoadButton = async () => {
    const data = localStorage.getItem('GRAPH_EDITOR_VIEW');
    if (data) {
      const parse_data = JSON.parse(data);
      await container.current.fromJSON(parse_data);
      AreaPlugin.zoomAt(container.current, container.current.nodes);
    }
  }
  return (
    <div className="Editor-wrapper">
        <div className="editor">
          <div className="container">
            <div className="node-editor"></div>
          </div>
          <div className="dock"></div>
        </div>
      <div className="Editor-save-load">
        <button onClick={handleClickSaveButton}>
          save
        </button>
        <button onClick={handleClickLoadButton}>
          load
        </button>
      </div>
      <div className="Editor-Playfield" ref={(ref) => ref && setContainer(ref)} />
    </div>
  );
}

export default EditorPage;
