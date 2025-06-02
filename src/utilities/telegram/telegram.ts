import axios, { AxiosResponse } from "axios";

export class TelegramBot {
  private static token: string = process.env.TELEGRAM_BOT_TOKEN || "";
  private static chatId: string = process.env.TELEGRAM_USER_ID || "";
  private static apiUrl: string = `https://api.telegram.org/bot${TelegramBot.token}/sendMessage`;

  // Static method to send a JSON message to a Telegram user
  static async sendJsonMessage(jsonData: any): Promise<void> {
    if (!TelegramBot.token || !TelegramBot.chatId) {
      return;
    }

    let message = JSON.stringify(jsonData, null, 4); // Pretty print JSON for message
    message = `\`\`\`\n${message}\n\`\`\` \n`; // Wrap in code block (triple backticks)

    // Split the message if it exceeds Telegram's max message length
    const maxMessageLength = 4096; // Telegram's message limit
    const messages = splitMessage(message, maxMessageLength);

    try {
      // Send the message parts
      for (const part of messages) {
        const payload = {
          chat_id: TelegramBot.chatId,
          text: part,
          parse_mode: "MarkdownV2", // Use MarkdownV2 for backticks to work properly
        };

        // Make the API request using axios
        const response: AxiosResponse = await axios.post(
          TelegramBot.apiUrl,
          payload
        );
      }
    } catch (error: any) {}
  }
}

// Helper function to split the message into multiple parts if it exceeds the Telegram message limit
function splitMessage(message: string, maxLength: number): string[] {
  const messages: string[] = [];
  while (message.length > maxLength) {
    // Split the message at the maxLength, and add it to the message array
    messages.push(message.substring(0, maxLength));
    message = message.substring(maxLength);
  }
  // Add the remaining part (if any) to the array
  if (message) {
    messages.push(message);
  }
  return messages;
}

export default TelegramBot;
