import * as vscode from "vscode";
import * as path from "path";

export class QuickaccessView {
  constructor(context: vscode.ExtensionContext) {
    const provider = new QuickaccessProvider();

    const view = vscode.window.createTreeView("quickaccessView", {
      treeDataProvider: provider,
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

class QuickaccessProvider implements vscode.TreeDataProvider<Item> {
  constructor() {}

  items: Key[] = [
    {
      path: "/home/christian/Dokumente/nuxt-vuetify-testing/.gitignore",
    },
  ];

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
