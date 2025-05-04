// src/webview.ts
import * as vscode from 'vscode';
import { OllamaClient } from './ollama';

export class ChatPanel {
  private static instance: ChatPanel | undefined;
  private panel: vscode.WebviewPanel;

  private constructor(context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      'codeBuddyChat',
      'Code Buddy',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [context.extensionUri]
      }
    );

    this.panel.webview.html = this.getWebviewContent();
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    this.panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'send') {
        try {
          const response = await OllamaClient.getInstance().generate(message.text);
          this.sendToWebview({ type: 'response', content: response });
        } catch (error) {
          this.sendToWebview({ 
            type: 'error', 
            content: error instanceof Error ? error.message : 'Request failed'
          });
        }
      }
    });
  }

  private sendToWebview(message: { type: string; content: string }) {
    this.panel.webview.postMessage(message);
  }

  private getWebviewContent() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" 
              content="default-src 'none'; 
                      img-src ${this.panel.webview.cspSource}; 
                      script-src 'unsafe-inline' ${this.panel.webview.cspSource};
                      style-src 'unsafe-inline' ${this.panel.webview.cspSource};">
        <style>
          body { 
            padding: 10px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
          }
          #input {
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
          }
        </style>
      </head>
      <body>
        <div id="messages"></div>
        <input id="input" placeholder="Ask Code Buddy..." />
        <script>
          const vscode = acquireVsCodeApi();
          const input = document.getElementById('input');
          
          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              vscode.postMessage({ command: 'send', text: input.value });
              input.value = '';
            }
          });

          window.addEventListener('message', (event) => {
            const messages = document.getElementById('messages');
            const message = document.createElement('div');
            message.textContent = event.data.content;
            message.style.color = event.data.type === 'error' ? 'red' : 'inherit';
            messages.appendChild(message);
          });
        </script>
      </body>
      </html>`;
  }

  public static createOrShow(context: vscode.ExtensionContext) {
    if (!ChatPanel.instance) {
      ChatPanel.instance = new ChatPanel(context);
    }
    return ChatPanel.instance;
  }
}