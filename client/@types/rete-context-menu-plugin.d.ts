declare module "rete-context-menu-plugin" {
  import { Plugin as RetePlugin } from 'rete/types/core/plugin';
  import * as Rete from 'rete';
  import Vue from 'vue';

  export interface ContextMenuPlugin extends RetePlugin {
    install: (editor: Rete.NodeEditor, options: {
      searchBar?: boolean,
      searchKeep?: (title: string) => boolean,
      delay?: number,
      items?: { [index: string]: () => any },
      nodeItems?: { [index: string]: boolean | (() => void) } | ((node: Node) => { [index: string]: (() => void) }),
      allocate?: (component: Rete.Component) => string[],
      rename?: (component: Rete.Component) => string;
      vueComponent?: typeof Vue.component
    }) => void
  }
  declare const _default: ContextMenuPlugin;
  export default _default;
}
