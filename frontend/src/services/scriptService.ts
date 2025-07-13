import { axios } from '../config/api';
import type { ScriptSummary, ScriptResponse, CreateScriptRequest } from '../types';

export const scriptService = {
  // Get all scripts
  getScripts: async (): Promise<ScriptResponse> => {
    const response = await axios.get<ScriptResponse>('/api/scripts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Get a single script by ID
  getScript: async (scriptId: string) => {
    const response = await axios.get(`/api/scripts/${scriptId}`);
    return response.data;
  },

  // Create a new script
  createScript: async (data: CreateScriptRequest): Promise<ScriptSummary> => {
    const response = await axios.post<ScriptSummary>('/api/scripts', data);
    return response.data;
  },

  // Update a script
  updateScript: async (scriptId: string, blocks: any) => {
    const response = await axios.put(`/api/scripts/${scriptId}`, { blocks });
    return response.data;
  },

  // Delete a script
  deleteScript: async (scriptId: string) => {
    await axios.delete(`/api/scripts/${scriptId}`);
  },

  // Get script editors
  getScriptEditors: async (scriptId: string) => {
    const response = await axios.get(`/api/scripts/${scriptId}/editors`);
    return response.data;
  },

  // Add editor to script
  addEditorToScript: async (scriptId: string, username: string) => {
    const response = await axios.post(`/api/scripts/${scriptId}/editors`, { username });
    return response.data;
  },

  // Remove editor from script
  removeEditorFromScript: async (scriptId: string, editorId: string) => {
    const response = await axios.delete(`/api/scripts/${scriptId}/editors/${editorId}`);
    return response.data;
  }
};
