# AllerPal Restaurant Chat System

This document provides instructions for setting up and using the restaurant chat system in AllerPal.

## Overview

The restaurant chat system allows users to communicate with restaurants via the AllerPal app. When a user sends a message to a restaurant:

1. The message is stored in the app's database
2. An email is sent to the restaurant's email address
3. The restaurant can reply directly to the email
4. The reply is processed and displayed in the user's chat interface

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

Note: For Gmail, you need to use an "App Password" rather than your regular password. You can generate one at https://myaccount.google.com/apppasswords after enabling 2-factor authentication.

### 2. Email Webhook Setup

To process incoming emails from restaurants, you need to set up an email webhook. We recommend using a service like [Mailgun](https://www.mailgun.com/) or [SendGrid](https://sendgrid.com/) to handle incoming emails.

Configure your email service to forward incoming emails to:
```
https://your-api-domain.com/api/email-webhook
```

### 3. Database Setup

Run the following commands to update your database schema:

```bash
cd allerpal-api
npm run strapi generate
npm run develop
```

This will create the necessary collections for chats and messages.

### 4. Update Restaurant Data

Ensure all restaurants in your database have a valid email address. You can update them through the Strapi admin panel.

## Usage

### Sending Messages to Restaurants

Users can send messages to restaurants from:
1. The restaurant details page
2. The chat inbox

When a user sends a message, they will receive an automatic response indicating that the restaurant will respond within 24 hours.

### Restaurant Responses

Restaurants receive emails with the user's message and can reply directly to the email. Their response will appear in the user's chat interface.

### Reminder System

If a restaurant doesn't respond within 24 hours, a reminder email is automatically sent to them.

## Troubleshooting

### Email Delivery Issues

If emails are not being delivered:
1. Check your SMTP settings
2. Verify the restaurant email addresses are correct
3. Check your email service provider's logs

### Message Processing Issues

If restaurant replies are not appearing in the app:
1. Check the email webhook configuration
2. Verify the email contains the correct reference ID
3. Check the server logs for any errors

## Technical Details

The system consists of:

1. **Frontend Components**:
   - Chat.jsx - Displays the list of conversations
   - ChatScreen.jsx - Displays individual conversations

2. **Backend Services**:
   - emailService.js - Handles sending emails to restaurants
   - chatService.js - Manages chat data and logic

3. **API Endpoints**:
   - GET /chats - Retrieves user's conversations
   - POST /messages - Creates new messages
   - POST /email-webhook - Processes incoming emails

4. **Database Collections**:
   - chats - Stores conversation metadata
   - messages - Stores individual messages

## Support

For any issues or questions, please contact the AllerPal development team. 