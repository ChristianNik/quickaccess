import * as vscode from "vscode";
import { Item } from "./item";
import { TreeItemCollapsibleState } from "vscode";
import * as fs from "fs";

export class QuickaccessProvider
  implements
    vscode.TreeDataProvider<vscode.TreeItem>,
    vscode.TreeDragAndDropController<vscode.TreeItem>
{
  tree: any = {
    "#4963": {
      "/home/christian/Dokumente/quickaccess/.gitignore": {},
    },
    "/home/christian/Dokumente/quickaccess/package.json": {},
  };

  constructor(private context: vscode.ExtensionContext) {
    this.fixTreeViewNotDropableWhenViewIsEmpty();
  }

  fixTreeViewNotDropableWhenViewIsEmpty() {
    if (this.items.length > 0) {
      return;
    }

    this.items = [
      // {
      //   path: "Loading...",
      // },
    ];

    setTimeout(() => {
      this.deleteItemByPath("Loading...");
    }, 100);
  }

  getTreeItem(element: Item | vscode.TreeItem): vscode.TreeItem {
    if (element instanceof Item) {
      return {
        resourceUri: element.resource,
        label: element.label,
        // resource: element.resource,
        tooltip: element.tooltip,
        description: element.description,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        command: {
          command: "vscode.open",
          arguments: [element.resource],
          title: "Open File",
        },
      };
    }

    return element;
  }

  getChildren(element?: vscode.TreeItem) {
    if (element) {
      return this.getNodes(this.tree[element.label as any]);
    }

    return this.getNodes(this.tree);
  }

  getNodes(node: any) {
    return Object.entries<Key>(node).map(([key, node]) => {
      const collapsibleState =
        Object.keys(node).length === 0
          ? TreeItemCollapsibleState.None
          : TreeItemCollapsibleState.Collapsed;

      if (this.pathExists(key)) {
        return Item.fromPath(key);
      }

      return new vscode.TreeItem(key, collapsibleState);
    });
  }

  refresh() {
    this.context.workspaceState.update("nodes", this.tree);
    this._onDidChangeTreeData.fire();
  }

  deleteItem(item: Item, tree: any) {
    this.deleteItemByPath(item.resource.path);
  }

  deleteItemByPath(path: string) {
    // this.items = this.items.filter((_item) => _item.path !== path);
    this.refresh();
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }

  dropMimeTypes: readonly string[] = ["text/uri-list"];
  dragMimeTypes: readonly string[] = [];

  private _onDidChangeTreeData: vscode.EventEmitter<Item[] | undefined | null | void> =
    new vscode.EventEmitter<Item[] | undefined | null | void>();

  public onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  handleDrop?(
    target: Item | undefined,
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const transferItem = dataTransfer.get("text/uri-list");

    if (!transferItem) {
      return;
    }

    const resource = vscode.Uri.file(transferItem.value);
    const filePath = resource.path.replace("/file://", "");

    // const itemExists = this.items.find((item) => item.path === filePath);
    // if (itemExists) {
    //   return;
    // }

    // this.items.push({
    //   path: filePath,
    // });
    this.refresh();
  }
}

interface Key {
  key: string;
}
