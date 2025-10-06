// Webmaster Agent - Advanced Website Management Module
// Comprehensive SEO optimization, performance monitoring, and site analysis

export class WebmasterAgentFunctions {
  constructor() {
    this.websites = new Map();
    this.seoReports = [];
    this.performanceTests = [];
    this.uptimeMonitoring = [];
    this.crawlResults = [];
    
    this.seoFactors = {
      titleTag: { weight: 10, maxLength: 60 },
      metaDescription: { weight: 8, maxLength: 160 },
      headings: { weight: 7, h1Required: true },
      images: { weight: 5, altRequired: true },
      internalLinks: { weight: 6, minCount: 3 },
      externalLinks: { weight: 4, maxCount: 10 },
      pageSpeed: { weight: 9, maxLoadTime: 3000 },
      mobileOptimization: { weight: 8, required: true }
    };
    
    this.performanceMetrics = {
      loadTime: 'Page Load Time',
      firstContentfulPaint: 'First Contentful Paint',
      largestContentfulPaint: 'Largest Contentful Paint',
      cumulativeLayoutShift: 'Cumulative Layout Shift',
      firstInputDelay: 'First Input Delay',
      totalBlockingTime: 'Total Blocking Time'
    };
    
    this.validationRules = {
      html: ['doctype', 'lang', 'charset', 'viewport'],
      css: ['syntax', 'unused', 'minification'],
      javascript: ['syntax', 'unused', 'minification'],
      accessibility: ['contrast', 'alt-text', 'keyboard-navigation']
    };
    
    this.initialize();
  }
  
  initialize() {
    this.startUptimeMonitoring();
    console.log('Webmaster Agent initialized with SEO and performance monitoring');
  }
  
  async addWebsite(websiteData) {
    try {
      const website = {
        id: this.generateWebsiteId(),
        url: websiteData.url,
        name: websiteData.name || new URL(websiteData.url).hostname,
        description: websiteData.description || '',
        category: websiteData.category || 'general',
        addedAt: new Date().toISOString(),
        lastAnalyzed: null,
        monitoring: {
          uptime: websiteData.monitoring?.uptime || false,
          performance: websiteData.monitoring?.performance || false,
          seo: websiteData.monitoring?.seo || false
        },
        notifications: {
          email: websiteData.notifications?.email || null,
          webhook: websiteData.notifications?.webhook || null
        }
      };
      
      this.websites.set(website.id, website);
      this.onWebsiteAdded?.(website);
      
      // Perform initial analysis
      if (websiteData.analyzeNow) {
        await this.analyzeWebsite(website.id);
      }
      
      return website;
    } catch (error) {
      this.onWebsiteError?.(websiteData, error);
      throw error;
    }
  }
  
  async analyzeWebsite(websiteId, analysisTypes = ['seo', 'performance', 'validation']) {
    try {
      const website = this.websites.get(websiteId);
      if (!website) {
        throw new Error('Website not found');
      }
      
      const analysis = {
        id: this.generateAnalysisId(),
        websiteId,
        url: website.url,
        types: analysisTypes,
        startedAt: new Date().toISOString(),
        status: 'running',
        results: {}
      };
      
      this.onAnalysisStart?.(analysis);
      
      // Perform each type of analysis
      for (const type of analysisTypes) {
        this.onAnalysisProgress?.(analysis.id, `Starting ${type} analysis...`);
        
        switch (type) {
          case 'seo':
            analysis.results.seo = await this.performSEOAnalysis(website.url);
            break;
          case 'performance':
            analysis.results.performance = await this.performPerformanceAnalysis(website.url);
            break;
          case 'validation':
            analysis.results.validation = await this.performValidation(website.url);
            break;
          case 'accessibility':
            analysis.results.accessibility = await this.performAccessibilityAnalysis(website.url);
            break;
          case 'security':
            analysis.results.security = await this.performSecurityAnalysis(website.url);
            break;
        }
      }
      
      analysis.completedAt = new Date().toISOString();
      analysis.status = 'completed';
      analysis.score = this.calculateOverallScore(analysis.results);
      
      // Update website
      website.lastAnalyzed = analysis.completedAt;
      
      this.onAnalysisComplete?.(analysis);
      return analysis;
      
    } catch (error) {
      this.onAnalysisError?.(websiteId, error);
      throw error;
    }
  }
  
  async performSEOAnalysis(url) {
    try {
      this.onSEOAnalysisStart?.(url);
      
      // Simulate fetching page content
      await this.delay(1000);
      const pageContent = await this.fetchPageContent(url);
      
      const seoAnalysis = {
        url,
        analyzedAt: new Date().toISOString(),
        title: this.analyzeTitleTag(pageContent),
        metaDescription: this.analyzeMetaDescription(pageContent),
        headings: this.analyzeHeadings(pageContent),
        images: this.analyzeImages(pageContent),
        links: this.analyzeLinks(pageContent),
        keywords: this.analyzeKeywords(pageContent),
        schema: this.analyzeSchema(pageContent),
        openGraph: this.analyzeOpenGraph(pageContent),
        recommendations: []
      };
      
      // Generate SEO recommendations
      seoAnalysis.recommendations = this.generateSEORecommendations(seoAnalysis);
      seoAnalysis.score = this.calculateSEOScore(seoAnalysis);
      
      this.seoReports.push(seoAnalysis);
      return seoAnalysis;
      
    } catch (error) {
      this.onSEOAnalysisError?.(url, error);
      throw error;
    }
  }
  
  async performPerformanceAnalysis(url) {
    try {
      this.onPerformanceAnalysisStart?.(url);
      
      // Simulate performance testing
      await this.delay(2000);
      
      const performance = {
        url,
        analyzedAt: new Date().toISOString(),
        metrics: {
          loadTime: Math.floor(Math.random() * 3000) + 500, // 0.5-3.5s
          firstContentfulPaint: Math.floor(Math.random() * 2000) + 300,
          largestContentfulPaint: Math.floor(Math.random() * 2500) + 800,
          firstInputDelay: Math.floor(Math.random() * 100) + 10,
          cumulativeLayoutShift: (Math.random() * 0.25).toFixed(3),
          totalBlockingTime: Math.floor(Math.random() * 500) + 50
        },
        resources: {
          totalRequests: Math.floor(Math.random() * 100) + 20,
          totalSize: Math.floor(Math.random() * 5000000) + 500000, // bytes
          images: Math.floor(Math.random() * 50) + 5,
          scripts: Math.floor(Math.random() * 20) + 3,
          stylesheets: Math.floor(Math.random() * 10) + 2
        },
        opportunities: [],
        diagnostics: []
      };
      
      // Generate performance opportunities
      performance.opportunities = this.generatePerformanceOpportunities(performance);
      performance.diagnostics = this.generatePerformanceDiagnostics(performance);
      performance.score = this.calculatePerformanceScore(performance.metrics);
      
      this.performanceTests.push(performance);
      return performance;
      
    } catch (error) {
      this.onPerformanceAnalysisError?.(url, error);
      throw error;
    }
  }
  
  async performValidation(url) {
    try {
      await this.delay(800);
      
      const validation = {
        url,
        analyzedAt: new Date().toISOString(),
        html: {
          valid: Math.random() > 0.3,
          errors: [],
          warnings: []
        },
        css: {
          valid: Math.random() > 0.4,
          errors: [],
          warnings: []
        },
        javascript: {
          valid: Math.random() > 0.5,
          errors: [],
          warnings: []
        }
      };
      
      // Generate mock validation errors
      if (!validation.html.valid) {
        validation.html.errors = [
          'Missing alt attribute on img element',
          'Unclosed div element',
          'Invalid character encoding'
        ];
      }
      
      if (!validation.css.valid) {
        validation.css.errors = [
          'Unknown property: -webkit-transform',
          'Parse error: missing semicolon'
        ];
      }
      
      if (!validation.javascript.valid) {
        validation.javascript.errors = [
          'Undefined variable: myVar',
          'Missing closing bracket'
        ];
      }
      
      validation.overallScore = this.calculateValidationScore(validation);
      
      return validation;
      
    } catch (error) {
      this.onValidationError?.(url, error);
      throw error;
    }
  }
  
  async performAccessibilityAnalysis(url) {
    try {
      await this.delay(1200);
      
      const accessibility = {
        url,
        analyzedAt: new Date().toISOString(),
        tests: {
          colorContrast: { passed: Math.random() > 0.2, issues: [] },
          altText: { passed: Math.random() > 0.3, issues: [] },
          keyboardNavigation: { passed: Math.random() > 0.4, issues: [] },
          focusManagement: { passed: Math.random() > 0.3, issues: [] },
          ariaLabels: { passed: Math.random() > 0.5, issues: [] }
        },
        compliance: {
          wcag2AA: Math.floor(Math.random() * 40) + 60, // 60-100%
          section508: Math.floor(Math.random() * 30) + 70 // 70-100%
        }
      };
      
      // Generate accessibility issues
      Object.keys(accessibility.tests).forEach(test => {
        if (!accessibility.tests[test].passed) {
          accessibility.tests[test].issues = [
            `${test} issue detected on multiple elements`,
            `Recommendation: Fix ${test} for better accessibility`
          ];
        }
      });
      
      accessibility.overallScore = this.calculateAccessibilityScore(accessibility);
      
      return accessibility;
      
    } catch (error) {
      this.onAccessibilityAnalysisError?.(url, error);
      throw error;
    }
  }
  
  async performSecurityAnalysis(url) {
    try {
      await this.delay(1500);
      
      const security = {
        url,
        analyzedAt: new Date().toISOString(),
        https: url.startsWith('https'),
        headers: {
          'Content-Security-Policy': Math.random() > 0.6,
          'X-Frame-Options': Math.random() > 0.5,
          'X-XSS-Protection': Math.random() > 0.7,
          'Strict-Transport-Security': Math.random() > 0.5
        },
        vulnerabilities: [],
        certificates: {
          valid: Math.random() > 0.1,
          expiresIn: Math.floor(Math.random() * 365) + 30, // days
          issuer: 'Let\'s Encrypt'
        }
      };
      
      // Check for security issues
      if (!security.https) {
        security.vulnerabilities.push({
          type: 'HTTP Usage',
          severity: 'high',
          description: 'Website is not using HTTPS encryption'
        });
      }
      
      Object.entries(security.headers).forEach(([header, present]) => {
        if (!present) {
          security.vulnerabilities.push({
            type: 'Missing Security Header',
            severity: 'medium',
            description: `Missing ${header} header`
          });
        }
      });
      
      security.score = this.calculateSecurityScore(security);
      
      return security;
      
    } catch (error) {
      this.onSecurityAnalysisError?.(url, error);
      throw error;
    }
  }
  
  // Content analysis methods
  async fetchPageContent(url) {
    // Simulate fetching page content
    return {
      html: `
        <html lang="en">
          <head>
            <title>Sample Page Title - ${url}</title>
            <meta name="description" content="This is a sample meta description for the page">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <h1>Main Heading</h1>
            <h2>Subheading 1</h2>
            <p>Sample content with <a href="/internal-link">internal link</a> and <a href="https://external.com">external link</a>.</p>
            <img src="/image1.jpg" alt="Sample image">
            <img src="/image2.jpg">
            <h2>Subheading 2</h2>
            <p>More content here.</p>
          </body>
        </html>
      `,
      text: 'Sample page content for analysis'
    };
  }
  
  analyzeTitleTag(content) {
    const titleMatch = content.html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    
    return {
      present: !!title,
      content: title,
      length: title ? title.length : 0,
      optimal: title && title.length >= 30 && title.length <= 60,
      recommendations: title ? 
        (title.length > 60 ? ['Title is too long'] : title.length < 30 ? ['Title is too short'] : []) :
        ['Missing title tag']
    };
  }
  
  analyzeMetaDescription(content) {
    const metaMatch = content.html.match(/<meta\s+name\s*=\s*["']description["']\s+content\s*=\s*["']([^"']+)["']/i);
    const description = metaMatch ? metaMatch[1].trim() : null;
    
    return {
      present: !!description,
      content: description,
      length: description ? description.length : 0,
      optimal: description && description.length >= 120 && description.length <= 160,
      recommendations: description ?
        (description.length > 160 ? ['Meta description is too long'] : description.length < 120 ? ['Meta description is too short'] : []) :
        ['Missing meta description']
    };
  }
  
  analyzeHeadings(content) {
    const headings = {
      h1: (content.html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || []).length,
      h2: (content.html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || []).length,
      h3: (content.html.match(/<h3[^>]*>([^<]+)<\/h3>/gi) || []).length,
      h4: (content.html.match(/<h4[^>]*>([^<]+)<\/h4>/gi) || []).length,
      h5: (content.html.match(/<h5[^>]*>([^<]+)<\/h5>/gi) || []).length,
      h6: (content.html.match(/<h6[^>]*>([^<]+)<\/h6>/gi) || []).length
    };
    
    const recommendations = [];
    if (headings.h1 === 0) recommendations.push('Missing H1 tag');
    if (headings.h1 > 1) recommendations.push('Multiple H1 tags found');
    
    return {
      structure: headings,
      total: Object.values(headings).reduce((sum, count) => sum + count, 0),
      recommendations
    };
  }
  
  analyzeImages(content) {
    const images = content.html.match(/<img[^>]+>/gi) || [];
    const withAlt = content.html.match(/<img[^>]+alt\s*=\s*["'][^"']*["'][^>]*>/gi) || [];
    
    return {
      total: images.length,
      withAlt: withAlt.length,
      withoutAlt: images.length - withAlt.length,
      altOptimization: withAlt.length / Math.max(images.length, 1) * 100,
      recommendations: images.length - withAlt.length > 0 ? 
        [`${images.length - withAlt.length} images missing alt attributes`] : []
    };
  }
  
  analyzeLinks(content) {
    const allLinks = content.html.match(/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi) || [];
    const internalLinks = allLinks.filter(link => !link.includes('http') || link.includes(new URL(content.url || 'http://example.com').hostname));
    const externalLinks = allLinks.filter(link => link.includes('http') && !link.includes(new URL(content.url || 'http://example.com').hostname));
    
    return {
      total: allLinks.length,
      internal: internalLinks.length,
      external: externalLinks.length,
      recommendations: allLinks.length === 0 ? ['No links found on page'] : []
    };
  }
  
  analyzeKeywords(content) {
    const text = content.text.toLowerCase();
    const words = text.split(/\s+/);
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    return {
      totalWords: words.length,
      uniqueWords: Object.keys(wordCount).length,
      topKeywords: sortedWords.map(([word, count]) => ({ word, count, density: (count / words.length * 100).toFixed(2) + '%' }))
    };
  }
  
  analyzeSchema(content) {
    const schemaScripts = content.html.match(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi) || [];
    
    return {
      present: schemaScripts.length > 0,
      count: schemaScripts.length,
      types: schemaScripts.length > 0 ? ['Organization', 'WebPage'] : [],
      recommendations: schemaScripts.length === 0 ? ['Consider adding structured data markup'] : []
    };
  }
  
  analyzeOpenGraph(content) {
    const ogTags = {
      'og:title': content.html.match(/<meta\s+property\s*=\s*["']og:title["'][^>]+>/i),
      'og:description': content.html.match(/<meta\s+property\s*=\s*["']og:description["'][^>]+>/i),
      'og:image': content.html.match(/<meta\s+property\s*=\s*["']og:image["'][^>]+>/i),
      'og:url': content.html.match(/<meta\s+property\s*=\s*["']og:url["'][^>]+>/i)
    };
    
    const presentTags = Object.entries(ogTags).filter(([,match]) => match).map(([tag]) => tag);
    const missingTags = Object.entries(ogTags).filter(([,match]) => !match).map(([tag]) => tag);
    
    return {
      present: presentTags.length > 0,
      tags: presentTags,
      missing: missingTags,
      recommendations: missingTags.length > 0 ? [`Missing Open Graph tags: ${missingTags.join(', ')}`] : []
    };
  }
  
  // Scoring methods
  calculateSEOScore(analysis) {
    let score = 0;
    let maxScore = 0;
    
    // Title tag scoring
    maxScore += this.seoFactors.titleTag.weight;
    if (analysis.title.optimal) score += this.seoFactors.titleTag.weight;
    else if (analysis.title.present) score += this.seoFactors.titleTag.weight * 0.5;
    
    // Meta description scoring
    maxScore += this.seoFactors.metaDescription.weight;
    if (analysis.metaDescription.optimal) score += this.seoFactors.metaDescription.weight;
    else if (analysis.metaDescription.present) score += this.seoFactors.metaDescription.weight * 0.5;
    
    // Headings scoring
    maxScore += this.seoFactors.headings.weight;
    if (analysis.headings.structure.h1 === 1) score += this.seoFactors.headings.weight * 0.7;
    if (analysis.headings.total > 2) score += this.seoFactors.headings.weight * 0.3;
    
    // Images scoring
    maxScore += this.seoFactors.images.weight;
    score += (analysis.images.altOptimization / 100) * this.seoFactors.images.weight;
    
    return Math.round((score / maxScore) * 100);
  }
  
  calculatePerformanceScore(metrics) {
    let score = 100;
    
    if (metrics.loadTime > 3000) score -= 30;
    else if (metrics.loadTime > 2000) score -= 15;
    
    if (metrics.firstContentfulPaint > 1800) score -= 20;
    else if (metrics.firstContentfulPaint > 1200) score -= 10;
    
    if (metrics.largestContentfulPaint > 2500) score -= 25;
    else if (metrics.largestContentfulPaint > 1800) score -= 12;
    
    if (metrics.firstInputDelay > 100) score -= 15;
    else if (metrics.firstInputDelay > 50) score -= 8;
    
    if (parseFloat(metrics.cumulativeLayoutShift) > 0.1) score -= 20;
    else if (parseFloat(metrics.cumulativeLayoutShift) > 0.05) score -= 10;
    
    return Math.max(score, 0);
  }
  
  calculateValidationScore(validation) {
    let score = 100;
    
    if (!validation.html.valid) score -= 30;
    if (!validation.css.valid) score -= 25;
    if (!validation.javascript.valid) score -= 20;
    
    score -= validation.html.errors.length * 5;
    score -= validation.css.errors.length * 3;
    score -= validation.javascript.errors.length * 3;
    
    return Math.max(score, 0);
  }
  
  calculateAccessibilityScore(accessibility) {
    const tests = Object.values(accessibility.tests);
    const passedTests = tests.filter(test => test.passed).length;
    
    return Math.round((passedTests / tests.length) * 100);
  }
  
  calculateSecurityScore(security) {
    let score = security.https ? 40 : 0;
    
    const presentHeaders = Object.values(security.headers).filter(present => present).length;
    score += (presentHeaders / Object.keys(security.headers).length) * 40;
    
    score -= security.vulnerabilities.length * 10;
    
    if (security.certificates.valid) score += 20;
    
    return Math.max(Math.min(score, 100), 0);
  }
  
  calculateOverallScore(results) {
    const scores = [];
    
    if (results.seo) scores.push(results.seo.score);
    if (results.performance) scores.push(results.performance.score);
    if (results.validation) scores.push(results.validation.overallScore);
    if (results.accessibility) scores.push(results.accessibility.overallScore);
    if (results.security) scores.push(results.security.score);
    
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }
  
  // Recommendation generators
  generateSEORecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.title.recommendations.length > 0) {
      recommendations.push(...analysis.title.recommendations.map(r => ({ type: 'title', message: r, priority: 'high' })));
    }
    
    if (analysis.metaDescription.recommendations.length > 0) {
      recommendations.push(...analysis.metaDescription.recommendations.map(r => ({ type: 'meta', message: r, priority: 'medium' })));
    }
    
    if (analysis.images.recommendations.length > 0) {
      recommendations.push(...analysis.images.recommendations.map(r => ({ type: 'images', message: r, priority: 'medium' })));
    }
    
    if (analysis.schema.recommendations.length > 0) {
      recommendations.push(...analysis.schema.recommendations.map(r => ({ type: 'schema', message: r, priority: 'low' })));
    }
    
    return recommendations;
  }
  
  generatePerformanceOpportunities(performance) {
    const opportunities = [];
    
    if (performance.metrics.loadTime > 3000) {
      opportunities.push({
        type: 'load-time',
        message: 'Reduce page load time by optimizing images and scripts',
        potentialSavings: '2-3 seconds'
      });
    }
    
    if (performance.resources.totalSize > 3000000) {
      opportunities.push({
        type: 'file-size',
        message: 'Compress and optimize resources to reduce total page size',
        potentialSavings: `${Math.round((performance.resources.totalSize - 1500000) / 1024 / 1024)}MB`
      });
    }
    
    if (performance.resources.images > 20) {
      opportunities.push({
        type: 'images',
        message: 'Optimize and lazy-load images to improve performance',
        potentialSavings: '1-2 seconds'
      });
    }
    
    return opportunities;
  }
  
  generatePerformanceDiagnostics(performance) {
    const diagnostics = [];
    
    if (performance.metrics.firstInputDelay > 100) {
      diagnostics.push({
        type: 'interactivity',
        message: 'Reduce JavaScript execution time to improve interactivity',
        severity: 'medium'
      });
    }
    
    if (parseFloat(performance.metrics.cumulativeLayoutShift) > 0.1) {
      diagnostics.push({
        type: 'layout-shift',
        message: 'Minimize layout shifts by defining image and ad dimensions',
        severity: 'high'
      });
    }
    
    return diagnostics;
  }
  
  // Uptime monitoring
  startUptimeMonitoring() {
    setInterval(() => {
      this.checkWebsiteUptime();
    }, 60000); // Check every minute
  }
  
  async checkWebsiteUptime() {
    const monitoredWebsites = Array.from(this.websites.values())
      .filter(site => site.monitoring.uptime);
    
    for (const website of monitoredWebsites) {
      try {
        // Simulate uptime check
        const isUp = Math.random() > 0.05; // 95% uptime simulation
        const responseTime = Math.floor(Math.random() * 1000) + 100;
        
        const uptimeCheck = {
          id: this.generateUptimeCheckId(),
          websiteId: website.id,
          url: website.url,
          timestamp: new Date().toISOString(),
          status: isUp ? 'up' : 'down',
          responseTime: isUp ? responseTime : null,
          statusCode: isUp ? 200 : 500
        };
        
        this.uptimeMonitoring.push(uptimeCheck);
        
        if (!isUp) {
          this.onWebsiteDown?.(website, uptimeCheck);
        }
        
      } catch (error) {
        console.error('Uptime check failed:', error);
      }
    }
  }
  
  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  generateWebsiteId() {
    return 'site_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  generateAnalysisId() {
    return 'analysis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  generateUptimeCheckId() {
    return 'uptime_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Public API methods
  getWebsites() {
    return Array.from(this.websites.values());
  }
  
  getWebsite(websiteId) {
    return this.websites.get(websiteId);
  }
  
  getRecentSEOReports(limit = 10) {
    return this.seoReports.slice(-limit).reverse();
  }
  
  getRecentPerformanceTests(limit = 10) {
    return this.performanceTests.slice(-limit).reverse();
  }
  
  getUptimeStats(websiteId, hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const checks = this.uptimeMonitoring
      .filter(check => check.websiteId === websiteId && new Date(check.timestamp) >= since);
    
    const upChecks = checks.filter(check => check.status === 'up').length;
    const totalChecks = checks.length;
    
    return {
      uptime: totalChecks > 0 ? ((upChecks / totalChecks) * 100).toFixed(2) + '%' : '0%',
      totalChecks,
      upChecks,
      downChecks: totalChecks - upChecks,
      avgResponseTime: checks.length > 0 ? 
        Math.round(checks.filter(c => c.responseTime).reduce((sum, c) => sum + c.responseTime, 0) / checks.filter(c => c.responseTime).length) : 0
    };
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.WebmasterAgentFunctions = WebmasterAgentFunctions;
}