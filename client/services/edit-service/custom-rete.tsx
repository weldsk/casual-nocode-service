import React, { useState, useEffect, useCallback, useRef } from "react";
import Rete, { Node, NodeEditor } from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { MyNode } from "../../components/editor-node-view/retenode.component";
import DockPlugin from "rete-dock-plugin";
import {NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

var numSocket = new Rete.Socket("Number value");

class NumControl extends Rete.Control {
  static component = ({ value, onChange }:{value:number, onChange:(v:number)=>void}) => (
    <input
      type="number"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(+e.target.value)}
    />
  );
  emitter: NodeEditor | null;
  component: ({ value, onChange }: { value: number; onChange: (v: number) => void; }) => JSX.Element;
  props: { readonly: boolean; value: unknown; onChange: (v: number) => void; };

  constructor(emitter:NodeEditor | null, key:string, node:Node, readonly:boolean = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;

    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter?.trigger("process");
      }
    };
  }

  setValue(val:number) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
  update() {}
}

class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
  }

  async builder(node:Node) {
    var out1 = new Rete.Output("num", "Number", numSocket);
    var ctrl = new NumControl(this.editor, "num", node);

    node.addControl(ctrl).addOutput(out1);
  }

  worker(node:NodeData, inputs:WorkerInputs, outputs:WorkerOutputs) {
    outputs["num"] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");

    this.data.component = MyNode; // optional
  }

  async builder(node:Node) {
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var inp2 = new Rete.Input("num2", "Number2", numSocket);
    var out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor?.nodes?.find((n) => n.id == node.id)?.controls.get("preview")?.setValue(sum);
    outputs["num"] = sum;
  }
}

export async function selectComponents(container: HTMLElement) {
  var components = [new NumComponent(), new AddComponent()];
  var editor = new Rete.NodeEditor("demo@0.1.0", container);

}

export async function createEditor(container: HTMLElement) {
  var components = [new NumComponent(), new AddComponent()];

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
  
  editor.use(ContextMenuPlugin, {
    searchBar: false, // true by default
    //searchKeep: title => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    allocate(component) {
      return null;
  },
    rename(component) {
      return component.name;
    },
    nodeItems: {
      'Delete': true, // don't show Delete item
      'Clone': true // or Clone item
    }
  });
  editor.use(DockPlugin, {
    container: document.querySelector(".dock"),
    plugins:[ReactRenderPlugin],
    itemClass: "item"
  });

  var engine = new Rete.Engine("demo@0.1.0");

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });
  /*
  var n1 = await components[0].createNode({ num: 2 });
  var n2 = await components[0].createNode({ num: 3 });
  var add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
  editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));
  */
  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        console.log("created");
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        console.log("destroy");
        editorRef.current.destroy();
      }
    };
  }, []);

  return [editorRef, setContainer];
}
