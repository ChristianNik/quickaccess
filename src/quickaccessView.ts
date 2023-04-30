import * as vscode from "vscode";
import * as path from "path";

export class QuickaccessView {
  constructor(context: vscode.ExtensionContext) {
    const provider = new QuickaccessProvider();

    const view = vscode.window.createTreeView("quickaccessView", {
      treeDataProvider: provider,
      dragAndDropController: provider,
    });
    context.subscriptions.push(view);

    vscode.commands.registerCommand("quickaccess.openFile", (resource: vscode.Uri) =>
      this.openResource(resource)
    );
  }

  private openResource(resource: vscode.Uri): void {
    vscode.window.showTextDocument(resource);
  }
}

class QuickaccessProvider
  implements vscode.TreeDataProvider<Item>, vscode.TreeDragAndDropController<Item>
{
  constructor() {}

  items: Key[] = [
    {
      path: "/home/christian/Dokumente/nuxt-vuetify-testing/.gitignore",
    },
  ];
  dropMimeTypes: readonly string[] = ["text/uri-list"];
  dragMimeTypes: readonly string[] = [];

  private _onDidChangeTreeData: vscode.EventEmitter<Item[] | undefined | null | void> =
    new vscode.EventEmitter<Item[] | undefined | null | void>();
  // We want to use an array as the event type, but the API for this is currently being finalized. Until it's finalized, use any.
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

    this._onDidChangeTreeData.fire();
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
        command: "quickaccess.openFile",
        arguments: [element.resource],
        title: "Open FTP Resource",
      },
    };
  }

  getChildren(element?: Item): Item[] {
    return this._getChildren();
  }

  _getChildren(): Item[] {
    return this.items.map((item) => {
      const resource = vscode.Uri.file(item.path);
      const basename = path.basename(resource.path);
      return new Item(basename, resource);
    });
  }
}

class Item extends vscode.TreeItem {
  constructor(public readonly label: string, public resource: vscode.Uri) {
    super(label);
    this.tooltip = `${this.resource.path}`;
    // this.description = this.resource.path;
  }
}

interface Key {
  path: string;
}
