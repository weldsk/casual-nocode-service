import { useRete } from "../services/edit-service/custom-rete";
import '../App.css';
import AreaPlugin from "rete-area-plugin";

function EditorPage() {
  const props = useRete();
  const container = props.container;
  const setContainer = props.setContainer;
  const handleClickSaveButton = () => {
    if (container) {
      localStorage.setItem('GRAPH_EDITOR_VIEW', JSON.stringify(container.toJSON()));
    }
  }
  const handleClickLoadButton = async () => {
    const data = localStorage.getItem('GRAPH_EDITOR_VIEW');
    if (data && container) {
      const parse_data = JSON.parse(data);
      await container.fromJSON(parse_data);
      AreaPlugin.zoomAt(container, container.nodes);
    }
  }
  return (
    <div className="Editor-wrapper">
      <div className="editor">
        <div className="container">
          <div className="node-editor"></div>
        </div>
        <h3>Node List</h3>
        <div className="dock"></div>
      </div>
      <div className="Editor-save-load">
        <button className="Editor-save-load-button" onClick={handleClickSaveButton}>
          save
        </button>
        <button className="Editor-save-load-button" onClick={handleClickLoadButton}>
          load
        </button>
      </div>
      <div className="Editor-Playfield" ref={(ref) => ref && setContainer(ref)} />
    </div>
  );
}

export default EditorPage;
