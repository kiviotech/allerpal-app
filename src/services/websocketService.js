import { io } from 'socket.io-client';
import { API_URL } from '../config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io(`${API_URL}/chat`, {
      auth: {
        userId
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
        this.socket.disconnect();
      } else {
        // Exponential backoff
        this.reconnectDelay *= 2;
        setTimeout(() => {
          this.socket.connect();
        }, this.reconnectDelay);
      }
    });

    // Chat events
    this.socket.on('message:new', (data) => {
      this.notifyListeners('message:new', data);
    });

    this.socket.on('message:status', (data) => {
      this.notifyListeners('message:status', data);
    });

    this.socket.on('chat:typing', (data) => {
      this.notifyListeners('chat:typing', data);
    });

    this.socket.on('chat:status', (data) => {
      this.notifyListeners('chat:status', data);
    });
  }

  // Join a specific chat room
  joinChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('chat:join', { chatId });
    }
  }

  // Leave a specific chat room
  leaveChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('chat:leave', { chatId });
    }
  }

  // Send typing indicator
  sendTyping(chatId, isTyping) {
    if (this.socket?.connected) {
      this.socket.emit('chat:typing', { chatId, isTyping });
    }
  }

  // Add event listener
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Remove event listener
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WebSocket] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  // Disconnect websocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

// Create singleton instance
const websocketService = new WebSocketService();
export default websocketService; 