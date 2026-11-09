export interface NotificationResult {
  success: boolean;
  provider: 'termii' | 'twilio' | 'simulation';
  messageId?: string;
  error?: string;
}

export class NotificationService {
  private provider: string;

  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'simulation';
  }

  async sendSMS(to: string, message: string): Promise<NotificationResult> {
    if (this.provider === 'termii') {
      const apiKey = process.env.TERMII_API_KEY;
      if (!apiKey) {
        return { success: false, provider: 'termii', error: 'Missing TERMII_API_KEY' };
      }

      try {
        const res = await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to,
            from: process.env.TERMII_SENDER_ID || 'JalsaSalana',
            sms: message,
            type: 'plain',
            channel: 'generic',
            api_key: apiKey,
          }),
        });
        const data = await res.json();
        return { success: res.ok, provider: 'termii', messageId: data.message_id };
      } catch (err: any) {
        return { success: false, provider: 'termii', error: err.message };
      }
    }

    // Default simulation for development & verification
    console.log(`[SMS SIMULATION] To: ${to} | Message: ${message}`);
    return {
      success: true,
      provider: 'simulation',
      messageId: `sim_${Date.now()}`,
    };
  }

  async sendWhatsAppDelegateAlert(to: string, message: string): Promise<NotificationResult> {
    console.log(`[WHATSAPP ALERT] To: ${to} | Message: ${message}`);
    return {
      success: true,
      provider: 'simulation',
      messageId: `wa_${Date.now()}`,
    };
  }
}

export const notificationService = new NotificationService();
