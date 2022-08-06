import React, { useState, useEffect, useRef } from "react";
import Rete, { Node, NodeEditor } from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import { MyNode } from "../../components/editor-node-view/retenode.component";
import DockPlugin from "rete-dock-plugin";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

let numSocket = new Rete.Socket("Number value");
let strSocket = new Rete.Socket("String");

class NumControl extends Rete.Control {
  static component = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
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
  component: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => JSX.Element;
  props: { readonly: boolean; value: unknown; onChange: (v: number) => void };

  constructor(
    emitter: NodeEditor | null,
    key: string,
    node: Node,
    readonly: boolean = false
  ) {
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
      },
    };
  }

  setValue(val: number) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
  update() {}
}

class MessageControl extends Rete.Control {
  static component = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      type="string"
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  emitter: NodeEditor | null;
  component: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => JSX.Element;
  props: { readonly: boolean; value: unknown; onChange: (v: string) => void };

  constructor(
    emitter: NodeEditor | null,
    key: string,
    node: Node,
    readonly: boolean = false
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = MessageControl.component;

    const initial = node.data[key] || "";

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter?.trigger("process");
      },
    };
  }

  setValue(val: string) {
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

  async builder(node: Node) {
    let out1 = new Rete.Output("num", "Number", numSocket);
    let ctrl = new NumControl(this.editor, "num", node);

    node.addControl(ctrl).addOutput(out1);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    outputs["num"] = node.data.num;
  }
}

class TimeComponent extends Rete.Component {
  constructor() {
    super("Time");
  }

  async builder(node: Node) {
    let inp1 = new Rete.Input("num1", "Number", numSocket);
    let inp2 = new Rete.Input("num2", "Number2", numSocket);
    let out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;

    if (typeof n1 === "number") {
      const outputControl = this.editor?.nodes
        ?.find((n) => n.id === node.id)
        ?.controls.get("preview");
      if (outputControl instanceof NumControl) {
        outputControl.setValue(n1);
        outputs["num"] = n1;
      }
    }
  }
}

class StrComponent extends Rete.Component {
  constructor() {
    super("Str");
  }

  async builder(node: Node) {
    let out1 = new Rete.Output("str", "Number", strSocket);
    let ctrl = new MessageControl(this.editor, "str", node);

    node.addControl(ctrl).addOutput(out1);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    outputs["str"] = node.data.str;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
    this.data = { component: MyNode };
  }

  async builder(node: Node) {
    let inp1 = new Rete.Input("num1", "Number", numSocket);
    let inp2 = new Rete.Input("num2", "Number2", numSocket);
    let out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));
    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data["num1"];
    let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data["num2"];
    if (typeof n1 === "number" && typeof n2 === "number") {
      let sum = n1 + n2;
      const outputControl = this.editor?.nodes
        ?.find((n) => n.id === node.id)
        ?.controls.get("preview");
      if (outputControl instanceof NumControl) {
        outputControl.setValue(sum);
        outputs["num"] = sum;
      }
    }
  }
}

class SubComponent extends Rete.Component {
  constructor() {
    super("Sub");
    this.data = { component: MyNode };
  }

  async builder(node: Node) {
    let inp1 = new Rete.Input("num1", "Number", numSocket);
    let inp2 = new Rete.Input("num2", "Number2", numSocket);
    let out = new Rete.Output("num", "Number", numSocket);
    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node))
      .addOutput(out);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data["num1"];
    let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data["num2"];
    if (typeof n1 === "number" && typeof n2 === "number") {
      let sub = n1 - n2;
      const outputControl = this.editor?.nodes
        ?.find((n) => n.id === node.id)
        ?.controls.get("preview");
      if (outputControl instanceof NumControl) {
        outputControl.setValue(sub);
        outputs["num"] = sub;
      }
    }
  }
}

class IfComponent extends Rete.Component {
  constructor() {
    super("If");
    this.data = { component: MyNode };
  }

  async builder(node: Node) {
    let inp1 = new Rete.Input("num1", "Number", numSocket);
    let inp2 = new Rete.Input("num2", "Number2", numSocket);
    let out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    let cond = 0;
    if (typeof n1 === "number" && typeof n2 === "number") {
      if (n1 > n2) {
        cond = 1;
      }
      const outputControl = this.editor?.nodes
        ?.find((n) => n.id === node.id)
        ?.controls.get("preview");
      if (outputControl instanceof NumControl) {
        outputControl.setValue(cond);
        outputs["num"] = cond;
      }
    }
  }
}
class CalComponent extends Rete.Component {
  constructor() {
    super("Cal");
    this.data = { component: MyNode };
  }

  async builder(node: Node) {
    let inp1 = new Rete.Input("num1", "Number", numSocket);
    let inp2 = new Rete.Input("num2", "Number2", numSocket);
    let inp3 = new Rete.Input("num3", "Number3", strSocket);
    let out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));
    inp3.addControl(new MessageControl(this.editor, "num3", node));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    let n3 = inputs["num3"].length ? inputs["num3"][0] : node.data.num3;
    let result = 0;
    if (typeof n1 === "number" && typeof n2 === "number" && typeof n3 === "string") {
      if (n3 === "+") {
        result = n1 + n2;
      } else if (n3 === "-") {
        result = n1 - n2;
      } else if (n3 === "*") {
        result = n1 * n2;
      } else if (n3 === "/") {
        result = n1 / n2;
      } else if (n3 === "^") {
        result = n1 ** n2;
      } else {
        result = n1;
      }
      const outputControl = this.editor?.nodes
      ?.find((n) => n.id === node.id)
      ?.controls.get("preview");
      if (outputControl instanceof NumControl) {
        outputControl.setValue(result);
        outputs["num"] = result;
      }
    }
  }
}

export async function createEditor(container: HTMLElement) {
  let components = [
    new NumComponent(),
    new AddComponent(),
    new SubComponent(),
    new CalComponent(),
    new StrComponent(),
    new IfComponent(),
    new TimeComponent(),
  ];

  let editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  editor.use(ContextMenuPlugin, {
    searchBar: false, // true by default
    //searchKeep: title => true, // leave item when searching, optional. For example, title => ['Refresh'].includes(title)
    delay: 100,
    allocate() {
      return null;
    },
    rename(component: { name: string }) {
      return component.name;
    },
    nodeItems: {
      Delete: true, // don't show Delete item
      Clone: true, // or Clone item
    },
  } as any);
  editor.use(DockPlugin, {
    container: document.querySelector(".dock"),
    plugins: [ReactRenderPlugin],
    itemClass: "item",
  } as any);

  let engine = new Rete.Engine("demo@0.1.0");

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });
  /*
  let n1 = await components[0].createNode({ num: 2 });
  let n2 = await components[0].createNode({ num: 3 });
  let add = await components[1].createNode();

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
    [
      "process",
      "nodecreated",
      "noderemoved",
      "connectioncreated",
      "connectionremoved",
    ],
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
  const [container, setContainer] = useState<HTMLElement>();
  const editorRef = useRef<NodeEditor>();

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

  return { container: editorRef.current, setContainer: setContainer };
}
