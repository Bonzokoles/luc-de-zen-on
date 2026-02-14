/**
 * MCP Safety System
 * System prompts and skill validation to ensure safe AI operations
 * Based on Anthropic Claude and OpenAI safety best practices
 */

export interface SafetyConfig {
  enablePromptValidation?: boolean;
  enableSkillValidation?: boolean;
  enableContentFiltering?: boolean;
  maxPromptLength?: number;
  allowedSkills?: string[];
  blockedPatterns?: RegExp[];
}

export interface SafetyCheckResult {
  safe: boolean;
  violations: string[];
  warnings: string[];
  sanitizedContent?: string;
}

/**
 * System prompts for safe AI operation
 */
export const SYSTEM_PROMPTS = {
  /**
   * Base safety prompt for all AI interactions
   */
  BASE_SAFETY: `You are a helpful AI assistant. Follow these safety guidelines:
1. Never generate harmful, dangerous, or illegal content
2. Protect user privacy and sensitive information
3. Be honest about your limitations
4. Refuse requests for unethical actions
5. Provide accurate and truthful information
6. Respect copyright and intellectual property
7. Avoid bias and discrimination
8. Don't impersonate real people without disclosure`,

  /**
   * Business context safety
   */
  BUSINESS_SAFETY: `When assisting with business tasks:
1. Don't provide financial advice without appropriate disclaimers
2. Respect confidential business information
3. Don't engage in fraudulent or deceptive practices
4. Follow data protection regulations (GDPR, etc.)
5. Don't generate misleading marketing content
6. Verify facts before providing business recommendations`,

  /**
   * Code generation safety
   */
  CODE_SAFETY: `When generating or reviewing code:
1. Never include hardcoded credentials or API keys
2. Follow security best practices (input validation, sanitization)
3. Avoid patterns that could lead to vulnerabilities (SQL injection, XSS, etc.)
4. Include security warnings for sensitive operations
5. Use secure dependencies and libraries
6. Don't generate code for malicious purposes`,

  /**
   * Data handling safety
   */
  DATA_SAFETY: `When handling data:
1. Protect personally identifiable information (PII)
2. Don't share or expose sensitive data
3. Follow data minimization principles
4. Respect user consent and privacy preferences
5. Use encryption for sensitive data
6. Don't store unnecessary personal information`,
};

/**
 * Allowed skills configuration
 * Skills that are verified safe for use
 */
export const SAFE_SKILLS = {
  // Content generation skills
  content: [
    'text-generation',
    'summarization',
    'translation',
    'paraphrasing',
    'grammar-check',
  ],
  
  // Business skills
  business: [
    'email-writing',
    'document-generation',
    'data-analysis',
    'report-generation',
    'task-management',
  ],
  
  // Technical skills
  technical: [
    'code-review',
    'documentation',
    'debugging-assistance',
    'api-integration',
    'testing',
  ],
  
  // Creative skills
  creative: [
    'brainstorming',
    'ideation',
    'content-planning',
    'social-media',
  ],
};

/**
 * Blocked patterns that indicate unsafe content
 */
const BLOCKED_PATTERNS = [
  // Credential patterns
  /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
  /password\s*[:=]\s*['"][^'"]+['"]/gi,
  /secret\s*[:=]\s*['"][^'"]+['"]/gi,
  /token\s*[:=]\s*['"][^'"]+['"]/gi,
  
  // Code injection patterns
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=\s*['"][^'"]*['"]/gi,
  
  // SQL injection patterns
  /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bUPDATE\b).*\bFROM\b/gi,
  
  // Command injection patterns
  /[;&|`$]\s*(rm|cat|curl|wget|bash|sh|eval|exec)/gi,
];

/**
 * Safety validator class
 */
export class MCPSafetyValidator {
  private config: Required<SafetyConfig>;

  constructor(config: SafetyConfig = {}) {
    this.config = {
      enablePromptValidation: config.enablePromptValidation ?? true,
      enableSkillValidation: config.enableSkillValidation ?? true,
      enableContentFiltering: config.enableContentFiltering ?? true,
      maxPromptLength: config.maxPromptLength ?? 10000,
      allowedSkills: config.allowedSkills ?? this.getAllSafeSkills(),
      blockedPatterns: config.blockedPatterns ?? BLOCKED_PATTERNS,
    };
  }

  /**
   * Get all safe skills as a flat array
   */
  private getAllSafeSkills(): string[] {
    return Object.values(SAFE_SKILLS).flat();
  }

  /**
   * Validate a prompt for safety
   */
  validatePrompt(prompt: string): SafetyCheckResult {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check prompt length
    if (this.config.enablePromptValidation && prompt.length > this.config.maxPromptLength) {
      violations.push(`Prompt exceeds maximum length of ${this.config.maxPromptLength} characters`);
    }

    // Check for blocked patterns
    if (this.config.enableContentFiltering) {
      for (const pattern of this.config.blockedPatterns) {
        if (pattern.test(prompt)) {
          violations.push(`Prompt contains potentially unsafe pattern: ${pattern.source}`);
        }
      }
    }

    // Check for sensitive keywords
    const sensitiveKeywords = ['password', 'secret', 'api_key', 'token', 'credential'];
    for (const keyword of sensitiveKeywords) {
      if (prompt.toLowerCase().includes(keyword)) {
        warnings.push(`Prompt contains sensitive keyword: ${keyword}`);
      }
    }

    return {
      safe: violations.length === 0,
      violations,
      warnings,
      sanitizedContent: violations.length === 0 ? prompt : undefined,
    };
  }

  /**
   * Validate a skill for safety
   */
  validateSkill(skillId: string): SafetyCheckResult {
    const violations: string[] = [];
    const warnings: string[] = [];

    if (!this.config.enableSkillValidation) {
      return { safe: true, violations, warnings };
    }

    // Check if skill is in allowed list
    if (!this.config.allowedSkills.includes(skillId)) {
      violations.push(`Skill '${skillId}' is not in the allowed skills list`);
      
      // Suggest similar allowed skills
      const suggestions = this.config.allowedSkills.filter(s => 
        s.includes(skillId.split('-')[0]) || skillId.includes(s.split('-')[0])
      );
      
      if (suggestions.length > 0) {
        warnings.push(`Similar allowed skills: ${suggestions.join(', ')}`);
      }
    }

    return {
      safe: violations.length === 0,
      violations,
      warnings,
    };
  }

  /**
   * Validate content (response from AI)
   */
  validateContent(content: string): SafetyCheckResult {
    const violations: string[] = [];
    const warnings: string[] = [];
    let sanitizedContent = content;

    if (!this.config.enableContentFiltering) {
      return { safe: true, violations, warnings, sanitizedContent };
    }

    // Check for blocked patterns in content
    for (const pattern of this.config.blockedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        violations.push(`Content contains unsafe pattern: ${pattern.source}`);
        // Redact the matched content
        sanitizedContent = sanitizedContent.replace(pattern, '[REDACTED]');
      }
    }

    // Check for potential PII
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    if (emailPattern.test(content)) {
      warnings.push('Content may contain email addresses');
    }
    
    if (phonePattern.test(content)) {
      warnings.push('Content may contain phone numbers');
    }

    return {
      safe: violations.length === 0,
      violations,
      warnings,
      sanitizedContent,
    };
  }

  /**
   * Get combined system prompt for safe operation
   */
  getSystemPrompt(context: 'business' | 'code' | 'data' | 'general' = 'general'): string {
    const prompts = [SYSTEM_PROMPTS.BASE_SAFETY];

    switch (context) {
      case 'business':
        prompts.push(SYSTEM_PROMPTS.BUSINESS_SAFETY);
        break;
      case 'code':
        prompts.push(SYSTEM_PROMPTS.CODE_SAFETY);
        break;
      case 'data':
        prompts.push(SYSTEM_PROMPTS.DATA_SAFETY);
        break;
    }

    return prompts.join('\n\n');
  }

  /**
   * Validate complete MCP request
   */
  validateMCPRequest(request: {
    prompt?: string;
    skillId?: string;
    content?: string;
  }): SafetyCheckResult {
    const allViolations: string[] = [];
    const allWarnings: string[] = [];

    // Validate prompt if present
    if (request.prompt) {
      const promptCheck = this.validatePrompt(request.prompt);
      allViolations.push(...promptCheck.violations);
      allWarnings.push(...promptCheck.warnings);
    }

    // Validate skill if present
    if (request.skillId) {
      const skillCheck = this.validateSkill(request.skillId);
      allViolations.push(...skillCheck.violations);
      allWarnings.push(...skillCheck.warnings);
    }

    // Validate content if present
    if (request.content) {
      const contentCheck = this.validateContent(request.content);
      allViolations.push(...contentCheck.violations);
      allWarnings.push(...contentCheck.warnings);
    }

    return {
      safe: allViolations.length === 0,
      violations: allViolations,
      warnings: allWarnings,
    };
  }
}

export default MCPSafetyValidator;
