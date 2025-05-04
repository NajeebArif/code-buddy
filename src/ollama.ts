// src/ollama.ts
import { Ollama } from '@langchain/ollama';
import axios from 'axios';

export class OllamaClient {
  private static instance: OllamaClient;
  public llm: Ollama;

  private constructor() {
    this.llm = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'deepseek-r1:1.5b',
      temperature: 0.3,
    });
  }

  static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient();
    }
    return OllamaClient.instance;
  }

  async checkHealth(): Promise<boolean> {
    try {
      await axios.get('http://localhost:11434');
      return true;
    } catch {
      return false;
    }
  }

  async generate(prompt: string): Promise<string> {
    try {
      return await this.llm.invoke(prompt);
    } catch (error) {
      throw new Error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}