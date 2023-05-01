import * as vscode from "vscode";
import { QuickaccessProvider } from "./quickaccessProvider";
import { Item } from "./item";

export class QuickaccessView {
  constructor(context: vscode.ExtensionContext) {
    const provider = new QuickaccessProvider(context);

    const view = vscode.window.createTreeView("quickaccessView", {
      treeDataProvider: provider,
      dragAndDropController: provider,
    });
    context.subscriptions.push(view);

    vscode.commands.registerCommand("quickaccess.openFile", (resource: vscode.Uri) =>
      this.openResource(resource)
    );

    vscode.commands.registerCommand("quickaccess.deleteItem", (item: Item) => {
      provider.deleteItem(item);
    });
  }

  private openResource(resource: vscode.Uri): void {
    vscode.window.showTextDocument(resource);
  }
}
