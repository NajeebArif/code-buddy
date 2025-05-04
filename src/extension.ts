// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ChatPanel } from './webview';
import { CodeContext } from './context';
import { OllamaClient } from './ollama';

const ollama: OllamaClient = OllamaClient.getInstance();


export function activate(context: vscode.ExtensionContext) {

	OllamaClient.getInstance().checkHealth().catch(() => {
		vscode.window.showErrorMessage('Ollama not running! Start it first.');
	});

	// Register chat command
	context.subscriptions.push(
		vscode.commands.registerCommand('code-buddy.chat', () => {
			ChatPanel.createOrShow(context);
		})
	);

	// Register inline suggestion command
	context.subscriptions.push(
		vscode.commands.registerCommand('code-buddy.suggest', async () => {
			const ctx = await CodeContext.getCurrentContext();
			const suggestion = await ollama.generate("Suggest code for current context:" + ctx);
			showInlineSuggestion(suggestion);
		})
	);
}

function showInlineSuggestion(text: string) {
	// Use Decoration API to display ghost text
}



// This method is called when your extension is deactivated
export function deactivate() { }
