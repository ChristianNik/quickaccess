import * as vscode from "vscode";
import { Item } from "./item";

export class QuickaccessProvider
  implements vscode.TreeDataProvider<Item>, vscode.TreeDragAndDropController<Item>
{
  items: Key[] = this.context.workspaceState.get<Key[]>("items") || [];

  constructor(private context: vscode.ExtensionContext) {
    this.fixTreeViewNotDropableWhenViewIsEmpty();
  }

  fixTreeViewNotDropableWhenViewIsEmpty() {
    if (this.items.length > 0) {
      return;
    }

    this.items = [
      {
        path: "Loading...",
      },
    ];

    setTimeout(() => {
      this.deleteItemByPath("Loading...");
    }, 100);
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

    const itemExists = this.items.find((item) => item.path === filePath);
    if (itemExists) {
      return;
    }

    this.items.push({
      path: filePath,
    });
    this.refresh();
  }

  resolveTreeItem?(
    item: vscode.TreeItem,
    element: Item,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }

  getTreeItem(element: Item): Item {
    return {
      resourceUri: element.resource,
      label: element.label,
      resource: element.resource,
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

  getChildren(element?: Item): Item[] {
    return this.items.map((item) => Item.fromPath(item.path));
  }

  refresh() {
    this.context.workspaceState.update("items", this.items);
    this._onDidChangeTreeData.fire();
  }

  deleteItem(item: Item) {
    this.deleteItemByPath(item.resource.path);
  }

  deleteItemByPath(path: string) {
    this.items = this.items.filter((_item) => _item.path !== path);
    this.refresh();
  }
}

interface Key {
  path: string;
}
