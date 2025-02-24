import { getHistory } from './service/historyService.js';

// Initialize history file
try {
    await getHistory();
} catch (error) {
    console.error('Failed to initialize history file:', error);
} 