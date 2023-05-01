import * as vscode from "vscode";

export class Item extends vscode.TreeItem {
  constructor(public readonly label: string, public resource: vscode.Uri) {
    super(label);
    this.tooltip = `${this.resource.path}`;
  }
}
