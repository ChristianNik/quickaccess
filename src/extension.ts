import * as vscode from "vscode";
import { QuickaccessView } from "./quickaccessView";

export function activate(context: vscode.ExtensionContext) {
  new QuickaccessView(context);
}

export function deactivate() {}
