// Email Agent - Advanced Email Management Module
// Multi-provider email handling with templates, scheduling, and analytics

export class EmailAgentFunctions {
  constructor() {
    this.emailProviders = {
      smtp: { name: "SMTP", port: 587, secure: true },
      gmail: { name: "Gmail", api: "gmail-api" },
      outlook: { name: "Outlook", api: "graph-api" },
      sendgrid: { name: "SendGrid", api: "sendgrid-api" },
      mailgun: { name: "Mailgun", api: "mailgun-api" },
      ses: { name: "Amazon SES", api: "aws-ses" },
    };

    this.emailQueue = [];
    this.sentEmails = [];
    this.templates = new Map();
    this.contacts = new Map();
    this.campaigns = new Map();

    this.settings = {
      defaultProvider: "smtp",
      maxConcurrentSends: 5,
      retryAttempts: 3,
      retryDelay: 2000,
      trackOpens: true,
      trackClicks: true,
      autoUnsubscribe: true,
    };

    this.analytics = {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      totalUnsubscribed: 0,
    };

    this.initialize();
  }

  initialize() {
    this.loadEmailTemplates();
    this.loadContacts();
    this.startEmailProcessor();
    console.log(
      "Email Agent initialized with providers:",
      Object.keys(this.emailProviders)
    );
  }

  async sendEmail(emailData) {
    try {
      const email = this.prepareEmail(emailData);

      if (email.sendAt && new Date(email.sendAt) > new Date()) {
        // Schedule for later
        return this.scheduleEmail(email);
      } else {
        // Send immediately
        return this.sendEmailNow(email);
      }
    } catch (error) {
      this.onEmailError?.(emailData, error);
      throw error;
    }
  }

  prepareEmail(emailData) {
    const emailId = this.generateEmailId();

    const email = {
      id: emailId,
      from: emailData.from || "noreply@mybonzo.com",
      to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
      cc: emailData.cc || [],
      bcc: emailData.bcc || [],
      subject: emailData.subject || "No Subject",
      html: emailData.html || "",
      text: emailData.text || this.htmlToText(emailData.html || ""),
      attachments: emailData.attachments || [],
      priority: emailData.priority || "normal",
      sendAt: emailData.sendAt || null,
      template: emailData.template || null,
      templateData: emailData.templateData || {},
      trackOpens:
        emailData.trackOpens !== undefined
          ? emailData.trackOpens
          : this.settings.trackOpens,
      trackClicks:
        emailData.trackClicks !== undefined
          ? emailData.trackClicks
          : this.settings.trackClicks,
      provider: emailData.provider || this.settings.defaultProvider,
      campaign: emailData.campaign || null,
      createdAt: new Date().toISOString(),
    };

    // Apply template if specified
    if (email.template) {
      email.html = this.applyTemplate(email.template, email.templateData);
      email.text = this.htmlToText(email.html);
    }

    // Add tracking pixels if enabled
    if (email.trackOpens) {
      email.html = this.addOpenTracking(email.html, email.id);
    }

    if (email.trackClicks) {
      email.html = this.addClickTracking(email.html, email.id);
    }

    return email;
  }

  async sendEmailNow(email) {
    try {
      this.onEmailSending?.(email);

      // Simulate email sending based on provider
      const result = await this.simulateEmailSend(email);

      // Update analytics
      this.analytics.totalSent++;
      if (result.delivered) {
        this.analytics.totalDelivered++;
      }

      // Store sent email
      const sentEmail = {
        ...email,
        result,
        sentAt: new Date().toISOString(),
        status: result.delivered ? "delivered" : "failed",
      };

      this.sentEmails.push(sentEmail);
      this.onEmailSent?.(sentEmail);

      return {
        emailId: email.id,
        success: result.delivered,
        messageId: result.messageId,
        provider: email.provider,
        deliveredTo: result.delivered ? email.to.length : 0,
      };
    } catch (error) {
      this.onEmailSendError?.(email, error);
      throw error;
    }
  }

  scheduleEmail(email) {
    const scheduledEmail = {
      ...email,
      status: "scheduled",
      scheduledAt: new Date().toISOString(),
    };

    this.emailQueue.push(scheduledEmail);
    this.onEmailScheduled?.(scheduledEmail);

    return {
      emailId: email.id,
      scheduled: true,
      sendAt: email.sendAt,
      queuePosition: this.emailQueue.length,
    };
  }

  async simulateEmailSend(email) {
    // Simulate network delay
    await this.delay(200 + Math.random() * 800);

    // Simulate delivery success/failure rates by provider
    const successRates = {
      smtp: 0.95,
      gmail: 0.98,
      outlook: 0.96,
      sendgrid: 0.99,
      mailgun: 0.98,
      ses: 0.97,
    };

    const successRate = successRates[email.provider] || 0.95;
    const delivered = Math.random() < successRate;

    return {
      messageId: this.generateMessageId(),
      delivered,
      provider: email.provider,
      timestamp: new Date().toISOString(),
      deliveryTime: Math.floor(Math.random() * 1000) + 100, // ms
    };
  }

  async sendBulkEmail(emailData, recipients) {
    try {
      const campaign = this.createCampaign(emailData, recipients);
      const results = [];

      this.onBulkEmailStart?.(campaign);

      // Process recipients in batches
      const batchSize = this.settings.maxConcurrentSends;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchPromises = batch.map((recipient) => {
          const personalizedEmail = this.personalizeEmail(emailData, recipient);
          return this.sendEmail(personalizedEmail);
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);

        // Progress update
        const progress = Math.min(
          ((i + batchSize) / recipients.length) * 100,
          100
        );
        this.onBulkEmailProgress?.(campaign.id, progress);

        // Delay between batches
        if (i + batchSize < recipients.length) {
          await this.delay(1000);
        }
      }

      campaign.completedAt = new Date().toISOString();
      campaign.results = results;
      this.onBulkEmailComplete?.(campaign);

      return {
        campaignId: campaign.id,
        totalRecipients: recipients.length,
        successful: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      };
    } catch (error) {
      this.onBulkEmailError?.(emailData, error);
      throw error;
    }
  }

  createCampaign(emailData, recipients) {
    const campaignId = this.generateCampaignId();

    const campaign = {
      id: campaignId,
      name: emailData.campaignName || `Campaign ${campaignId}`,
      subject: emailData.subject,
      recipients: recipients.length,
      createdAt: new Date().toISOString(),
      status: "running",
      completedAt: null,
      results: null,
    };

    this.campaigns.set(campaignId, campaign);
    return campaign;
  }

  personalizeEmail(emailData, recipient) {
    return {
      ...emailData,
      to: recipient.email,
      templateData: {
        ...emailData.templateData,
        ...recipient,
      },
    };
  }

  createTemplate(name, template) {
    const templateData = {
      id: this.generateTemplateId(),
      name,
      subject: template.subject || "Template Subject",
      html: template.html || "",
      text: template.text || "",
      variables: template.variables || [],
      category: template.category || "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(name, templateData);
    this.onTemplateCreated?.(templateData);

    return templateData;
  }

  applyTemplate(templateName, data) {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    let html = template.html;

    // Replace variables in template
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      html = html.replace(regex, value);
    });

    // Replace remaining variables with defaults
    html = html.replace(/{{.*?}}/g, "");

    return html;
  }

  addContact(contactData) {
    const contactId = this.generateContactId();

    const contact = {
      id: contactId,
      email: contactData.email,
      name: contactData.name || "",
      firstName: contactData.firstName || "",
      lastName: contactData.lastName || "",
      company: contactData.company || "",
      phone: contactData.phone || "",
      tags: contactData.tags || [],
      subscribed: contactData.subscribed !== false,
      customFields: contactData.customFields || {},
      addedAt: new Date().toISOString(),
      lastEmailedAt: null,
    };

    this.contacts.set(contact.email, contact);
    this.onContactAdded?.(contact);

    return contact;
  }

  updateContact(email, updates) {
    const contact = this.contacts.get(email);
    if (!contact) {
      throw new Error(`Contact not found: ${email}`);
    }

    Object.assign(contact, updates, {
      updatedAt: new Date().toISOString(),
    });

    this.onContactUpdated?.(contact);
    return contact;
  }

  unsubscribeContact(email) {
    const contact = this.contacts.get(email);
    if (contact) {
      contact.subscribed = false;
      contact.unsubscribedAt = new Date().toISOString();
      this.analytics.totalUnsubscribed++;
      this.onContactUnsubscribed?.(contact);
    }
  }

  // Email tracking methods
  trackEmailOpen(emailId) {
    const email = this.sentEmails.find((e) => e.id === emailId);
    if (email) {
      email.openedAt = new Date().toISOString();
      email.opened = true;
      this.analytics.totalOpened++;
      this.onEmailOpened?.(email);
    }
  }

  trackEmailClick(emailId, url) {
    const email = this.sentEmails.find((e) => e.id === emailId);
    if (email) {
      if (!email.clicks) email.clicks = [];
      email.clicks.push({
        url,
        clickedAt: new Date().toISOString(),
      });
      this.analytics.totalClicked++;
      this.onEmailClicked?.(email, url);
    }
  }

  trackEmailBounce(emailId, reason) {
    const email = this.sentEmails.find((e) => e.id === emailId);
    if (email) {
      email.bounced = true;
      email.bounceReason = reason;
      email.bouncedAt = new Date().toISOString();
      this.analytics.totalBounced++;
      this.onEmailBounced?.(email, reason);
    }
  }

  // Template loading
  loadEmailTemplates() {
    const defaultTemplates = {
      welcome: {
        subject: "Welcome to MyBonzo!",
        html: `
          <h1>Welcome {{name}}!</h1>
          <p>Thank you for joining MyBonzo. We're excited to have you on board!</p>
          <p>Your account email: {{email}}</p>
          <p>Best regards,<br>The MyBonzo Team</p>
        `,
        variables: ["name", "email"],
      },
      notification: {
        subject: "Notification: {{title}}",
        html: `
          <h2>{{title}}</h2>
          <p>{{message}}</p>
          <p>Time: {{timestamp}}</p>
        `,
        variables: ["title", "message", "timestamp"],
      },
      newsletter: {
        subject: "MyBonzo Newsletter - {{month}} {{year}}",
        html: `
          <h1>Newsletter</h1>
          <p>Dear {{name}},</p>
          <p>Here's what's new this month:</p>
          <div>{{content}}</div>
          <p>Best regards,<br>MyBonzo Team</p>
        `,
        variables: ["name", "month", "year", "content"],
      },
    };

    Object.entries(defaultTemplates).forEach(([name, template]) => {
      this.createTemplate(name, template);
    });
  }

  // Contact loading
  loadContacts() {
    const defaultContacts = [
      {
        email: "admin@mybonzo.com",
        name: "Admin User",
        tags: ["admin", "internal"],
      },
      {
        email: "test@example.com",
        name: "Test User",
        tags: ["test"],
      },
    ];

    defaultContacts.forEach((contact) => {
      this.addContact(contact);
    });
  }

  // Email queue processor
  startEmailProcessor() {
    setInterval(() => {
      this.processScheduledEmails();
    }, 60000); // Check every minute
  }

  processScheduledEmails() {
    const now = new Date();
    const emailsToSend = this.emailQueue.filter(
      (email) => email.status === "scheduled" && new Date(email.sendAt) <= now
    );

    // Process emails concurrently with proper error handling
    emailsToSend.forEach((email) => {
      (async () => {
        try {
          email.status = "sending";
          await this.sendEmailNow(email);

          // Remove from queue
          this.emailQueue = this.emailQueue.filter((e) => e.id !== email.id);
        } catch (error) {
          email.status = "failed";
          this.onScheduledEmailError?.(email, error);
        }
      })().catch((error) => {
        console.error("Email processing failed:", error);
        email.status = "failed";
        this.onScheduledEmailError?.(email, error);
      });
    });
  }

  // Utility methods
  addOpenTracking(html, emailId) {
    const trackingPixel = `<img src="https://track.mybonzo.com/open/${emailId}" width="1" height="1" style="display:none;">`;
    return html + trackingPixel;
  }

  addClickTracking(html, emailId) {
    // Replace links with tracked redirect URLs
    return html.replace(
      /<a\s+([^>]*href\s*=\s*["'])([^"']+)(["'][^>]*)>/gi,
      (match, prefix, url, suffix) => {
        const decodedUrl = url.replace(/&amp;/gi, "&");
        const trackingUrl = `https://track.mybonzo.com/click/${emailId}?redirect=${encodeURIComponent(
          decodedUrl
        )}`;
        return `<a ${prefix}${trackingUrl}${suffix} data-original-url="${url}" data-tracking-email-id="${emailId}">`;
      }
    );
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  generateEmailId() {
    return (
      "email_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  generateMessageId() {
    return "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  generateCampaignId() {
    return (
      "campaign_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  generateTemplateId() {
    return (
      "template_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  generateContactId() {
    return (
      "contact_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  // Analytics and reporting
  getEmailAnalytics() {
    return {
      ...this.analytics,
      openRate:
        this.analytics.totalSent > 0
          ? (
              (this.analytics.totalOpened / this.analytics.totalSent) *
              100
            ).toFixed(2) + "%"
          : "0%",
      clickRate:
        this.analytics.totalSent > 0
          ? (
              (this.analytics.totalClicked / this.analytics.totalSent) *
              100
            ).toFixed(2) + "%"
          : "0%",
      bounceRate:
        this.analytics.totalSent > 0
          ? (
              (this.analytics.totalBounced / this.analytics.totalSent) *
              100
            ).toFixed(2) + "%"
          : "0%",
    };
  }

  getRecentEmails(limit = 20) {
    return this.sentEmails.slice(-limit).reverse();
  }

  getEmailQueue() {
    return this.emailQueue.filter((email) => email.status === "scheduled");
  }

  getTemplates() {
    return Array.from(this.templates.values());
  }

  getContacts() {
    return Array.from(this.contacts.values());
  }

  getCampaigns() {
    return Array.from(this.campaigns.values());
  }
}

// Export for global access
if (typeof window !== "undefined") {
  window.EmailAgentFunctions = EmailAgentFunctions;
}
