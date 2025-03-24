import apiClient from '../apiClient';
import emailEndpoints from '../endpoints/emailEndpoints';

export const sendChatMessage = (data) => 
  apiClient.post(emailEndpoints.sendChatMessage, data);

export const sendReminderEmail = (data) =>
  apiClient.post(emailEndpoints.sendReminder, data);

export const testEmail = (data) =>
  apiClient.post(emailEndpoints.testEmail, data);

export default {
  sendChatMessage,
  sendReminderEmail,
  testEmail
}; 