declare module "rete-area-plugin" {
  import { Plugin as RetePlugin } from 'rete/types/core/plugin';
  import * as Rete from 'rete';


  export interface Params{
    background:boolean,
    snap:boolean,
    scaleExtent:boolean,
    translateExtent:boolean
  }

  export interface AreaPlugin extends RetePlugin {
    install: (editor: Rete.NodeEditor, options: {
      params?: Params
    }) => void,
    zoomAt: (editor:Rete.NodeEditor, nodes:Rete.Node[]) => void
  }
  declare const _default: AreaPlugin;
  export default _default;
}
