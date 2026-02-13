/**
 * OUTPUT Node Implementation
 * Handles final output to various destinations
 */

import type { OutputNode } from './universal';

export interface OutputResult {
  success: boolean;
  destination: string;
  message?: string;
  error?: string;
  metadata?: {
    destination: string;
    target?: string;
    executionTime: number;
  };
}

/**
 * Execute OUTPUT node
 */
export async function executeOutput(
  node: OutputNode,
  input?: any
): Promise<OutputResult> {
  const startTime = Date.now();
  
  try {
    let result: string;

    switch (node.config.destination) {
      case 'email':
        result = await sendEmail(node, input);
        break;
      
      case 'pdf':
        result = await generatePDF(node, input);
        break;
      
      case 'slack':
        result = await sendSlack(node, input);
        break;
      
      case 'webhook':
        result = await sendWebhook(node, input);
        break;
      
      case 'database':
        result = await saveToDatabase(node, input);
        break;
      
      case 'file':
        result = await saveToFile(node, input);
        break;
      
      default:
        throw new Error(`Unknown destination: ${node.config.destination}`);
    }

    return {
      success: true,
      destination: node.config.destination,
      message: result,
      metadata: {
        destination: node.config.destination,
        target: node.config.target,
        executionTime: Date.now() - startTime
      }
    };
  } catch (error) {
    return {
      success: false,
      destination: node.config.destination,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        destination: node.config.destination,
        target: node.config.target,
        executionTime: Date.now() - startTime
      }
    };
  }
}

/**
 * Send email
 */
async function sendEmail(node: OutputNode, input?: any): Promise<string> {
  const to = node.config.target;
  
  if (!to) {
    throw new Error('Email destination requires target (email address)');
  }

  // In production, integrate with email service (SendGrid, Resend, etc.)
  console.log(`[OUTPUT] Would send email to: ${to}`);
  console.log('[OUTPUT] Content:', input);

  return `Email queued to ${to}`;
}

/**
 * Generate PDF
 */
async function generatePDF(node: OutputNode, input?: any): Promise<string> {
  const filepath = node.config.target || '/tmp/output.pdf';

  // In production, use jsPDF or similar library
  console.log(`[OUTPUT] Would generate PDF: ${filepath}`);
  console.log('[OUTPUT] Content:', input);

  return `PDF generated: ${filepath}`;
}

/**
 * Send to Slack
 */
async function sendSlack(node: OutputNode, input?: any): Promise<string> {
  const webhookUrl = node.config.target;
  
  if (!webhookUrl) {
    throw new Error('Slack destination requires webhook URL in target');
  }

  // Format message
  const message = node.config.template
    ? formatTemplate(node.config.template, input)
    : JSON.stringify(input, null, 2);

  // In production, send to Slack webhook
  console.log(`[OUTPUT] Would send to Slack: ${webhookUrl}`);
  console.log('[OUTPUT] Message:', message);

  return `Message sent to Slack`;
}

/**
 * Send to webhook
 */
async function sendWebhook(node: OutputNode, input?: any): Promise<string> {
  const url = node.config.target;
  
  if (!url) {
    throw new Error('Webhook destination requires URL in target');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    return `Webhook delivered to ${url}`;
  } catch (error) {
    throw new Error(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save to database
 */
async function saveToDatabase(node: OutputNode, input?: any): Promise<string> {
  // In production, integrate with database (D1, Postgres, etc.)
  console.log('[OUTPUT] Would save to database');
  console.log('[OUTPUT] Data:', input);

  return 'Data saved to database';
}

/**
 * Save to file
 */
async function saveToFile(node: OutputNode, input?: any): Promise<string> {
  const filepath = node.config.target || '/tmp/output.json';

  // In production, write to file system
  console.log(`[OUTPUT] Would save to file: ${filepath}`);
  console.log('[OUTPUT] Data:', input);

  return `File saved: ${filepath}`;
}

/**
 * Format template with data
 */
function formatTemplate(template: string, data: any): string {
  let result = template;
  
  // Simple template replacement: {{key}}
  if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
  }

  return result;
}

/**
 * Validate OUTPUT node configuration
 */
export function validateOutputConfig(node: OutputNode): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!node.config.destination) {
    errors.push('destination is required');
  }

  const validDest = ['email', 'pdf', 'slack', 'webhook', 'database', 'file'];
  if (node.config.destination && !validDest.includes(node.config.destination)) {
    errors.push(`Invalid destination. Must be one of: ${validDest.join(', ')}`);
  }

  // Destination-specific validation
  if (['email', 'slack', 'webhook'].includes(node.config.destination) && !node.config.target) {
    errors.push(`${node.config.destination} destination requires target`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  executeOutput,
  validateOutputConfig
};
