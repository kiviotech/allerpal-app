import { checkNewMessages, checkChatMessages } from '../api/repositories/chatRepositories';

class ChatPollingService {
  constructor() {
    this.pollingIntervals = new Map(); // Store intervals for different chats
    this.errorCounts = new Map(); // Track consecutive errors
    this.lastMessageTimes = {}; // Store last message time for each chat
    this.userEmail = null; // User email for authentication
    this.baseInterval = 5000; // 5 seconds
    this.maxInterval = 30000; // 30 seconds
    this.maxErrorCount = 3;
  }

  // Set the user email
  setUserEmail(email) {
    this.userEmail = email;
  }

  // Start polling for a specific chat
  startChatPolling(chatId, lastMessageTime, onNewMessages, onStatusChange, onError) {
    // Validate chat ID
    if (!chatId) {
      console.warn('[ChatPolling] Cannot start polling: Chat ID is undefined');
      if (onError) {
        onError(new Error('Chat ID is required for polling'));
      }
      return;
    }
    
    if (this.pollingIntervals.has(chatId)) {
      return; // Already polling this chat
    }

    // Store the initial last message time
    this.lastMessageTimes[chatId] = lastMessageTime;

    const poll = async () => {
      try {
        console.log(`[ChatPolling] Checking messages for chat ${chatId}...`);
        
        // Validate lastMessageTime to prevent future dates
        let validLastMessageTime = this.lastMessageTimes[chatId];
        const currentTime = new Date();
        const lastMessageDate = new Date(validLastMessageTime);
        
        // If lastMessageTime is in the future, use current time instead
        if (lastMessageDate > currentTime) {
          console.warn(`[ChatPolling] Future date detected in lastMessageTime: ${validLastMessageTime}, using current time instead`);
          validLastMessageTime = currentTime.toISOString();
          this.lastMessageTimes[chatId] = validLastMessageTime;
        }
        
        // Backup in case date is invalid
        if (isNaN(lastMessageDate.getTime())) {
          console.warn(`[ChatPolling] Invalid date detected in lastMessageTime: ${validLastMessageTime}, using current time instead`);
          validLastMessageTime = currentTime.toISOString();
          this.lastMessageTimes[chatId] = validLastMessageTime;
        }
        
        const response = await checkChatMessages(chatId, validLastMessageTime, this.userEmail);
        
        if (response && response.data && response.data.data) {
          const { newMessages, status, unreadCount } = response.data.data;
          
          // Process new messages if available
          if (newMessages && newMessages.length > 0) {
            console.log(`[ChatPolling] Found ${newMessages.length} new messages for chat ${chatId}`);
            
            // Format messages for UI if needed
            const formattedMessages = newMessages.map(msg => ({
              id: msg.id,
              content: msg.text || msg.content,
              sender: msg.sender,
              timestamp: msg.timestamp || msg.createdAt,
              read: msg.read || false
            }));
            
            // Call callback with new messages
            if (onNewMessages) onNewMessages(formattedMessages);
            
            // Update last message time for this chat
            const latestMessage = formattedMessages.reduce((latest, msg) => {
              return !latest || new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
            }, null);
            
            if (latestMessage) {
              this.lastMessageTimes[chatId] = latestMessage.timestamp;
            }
          }
          
          // Check if status has changed
          if (status && onStatusChange) {
            onStatusChange(status);
          }
          
          // Reset error count on success
          this.errorCounts.set(chatId, 0);
          
          // Reset polling interval to base
          this.pollingIntervals.set(chatId, {
            intervalId: null,
            interval: this.baseInterval
          });
        }
      } catch (error) {
        console.error(`[ChatPolling] Error checking messages for chat ${chatId}:`, error);
        
        // Increment error count
        const errorCount = (this.errorCounts.get(chatId) || 0) + 1;
        this.errorCounts.set(chatId, errorCount);

        // If we've hit max errors, stop polling and notify
        if (errorCount >= this.maxErrorCount) {
          this.stopChatPolling(chatId);
          onError(new Error('Max polling errors reached'));
          return;
        }

        // Exponential backoff for the polling interval
        const currentInterval = this.pollingIntervals.get(chatId)?.interval || this.baseInterval;
        const newInterval = Math.min(currentInterval * 2, this.maxInterval);
        
        this.updatePollingInterval(chatId, newInterval);
      }
    };

    // Initial poll
    poll();

    // Set up interval
    const intervalId = setInterval(poll, this.baseInterval);
    this.pollingIntervals.set(chatId, {
      intervalId,
      interval: this.baseInterval
    });
  }

  // Start polling for all user's chats
  startInboxPolling(userId, onNewChats, onError) {
    if (this.pollingIntervals.has('inbox')) {
      return; // Already polling inbox
    }

    const poll = async () => {
      try {
        console.log('[ChatPolling] Checking for new chats...');
        const response = await checkNewMessages(userId);
        const chatsWithNewMessages = response.data?.data || [];

        // Reset error count on successful poll
        this.errorCounts.set('inbox', 0);

        if (chatsWithNewMessages.length > 0) {
          console.log(`[ChatPolling] Found updates in ${chatsWithNewMessages.length} chats`);
          onNewChats(chatsWithNewMessages);
        }

      } catch (error) {
        console.error('[ChatPolling] Error polling inbox:', error);
        
        // Increment error count
        const errorCount = (this.errorCounts.get('inbox') || 0) + 1;
        this.errorCounts.set('inbox', errorCount);

        // If we've hit max errors, stop polling and notify
        if (errorCount >= this.maxErrorCount) {
          this.stopInboxPolling();
          onError(new Error('Max polling errors reached'));
          return;
        }

        // Exponential backoff for the polling interval
        const currentInterval = this.pollingIntervals.get('inbox')?.interval || this.baseInterval;
        const newInterval = Math.min(currentInterval * 2, this.maxInterval);
        
        this.updatePollingInterval('inbox', newInterval);
      }
    };

    // Initial poll
    poll();

    // Set up interval
    const intervalId = setInterval(poll, this.baseInterval);
    this.pollingIntervals.set('inbox', {
      intervalId,
      interval: this.baseInterval
    });
  }

  // Update polling interval for a specific chat or inbox
  updatePollingInterval(id, newInterval) {
    const current = this.pollingIntervals.get(id);
    if (current) {
      clearInterval(current.intervalId);
      const intervalId = setInterval(
        id === 'inbox' ? this.pollInbox : () => this.pollChat(id),
        newInterval
      );
      this.pollingIntervals.set(id, {
        intervalId,
        interval: newInterval
      });
    }
  }

  // Stop polling for a specific chat
  stopChatPolling(chatId) {
    const interval = this.pollingIntervals.get(chatId);
    if (interval) {
      clearInterval(interval.intervalId);
      this.pollingIntervals.delete(chatId);
      this.errorCounts.delete(chatId);
    }
  }

  // Stop polling inbox
  stopInboxPolling() {
    const interval = this.pollingIntervals.get('inbox');
    if (interval) {
      clearInterval(interval.intervalId);
      this.pollingIntervals.delete('inbox');
      this.errorCounts.delete('inbox');
    }
  }

  // Stop all polling
  stopAll() {
    for (const [id, interval] of this.pollingIntervals) {
      clearInterval(interval.intervalId);
    }
    this.pollingIntervals.clear();
    this.errorCounts.clear();
  }
}

// Create singleton instance
const chatPollingService = new ChatPollingService();
export default chatPollingService; 