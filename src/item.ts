import path = require("path");
import * as vscode from "vscode";

export class Item extends vscode.TreeItem {
  constructor(public readonly label: string, public resource: vscode.Uri) {
    super(label);
    this.tooltip = `${this.resource.path}`;
  }

  static fromPath(filePath: string) {
    const resource = vscode.Uri.file(filePath);
    const basename = path.basename(resource.path);
    return new this(basename, resource);
  }
}
