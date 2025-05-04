import * as vscode from "vscode";

export class CodeContext {
  static async getCurrentContext() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return "";
    
    return {
      code: editor.document.getText(),
      language: editor.document.languageId,
      selection: editor.document.getText(editor.selection),
      relatedFiles: await this.getRelatedFiles(editor.document.uri, 2) // 2 dir levels
    };
  }

  private static async getRelatedFiles(uri: vscode.Uri, depth: number) {
    // Implement file tree traversal with depth limit
  }
}