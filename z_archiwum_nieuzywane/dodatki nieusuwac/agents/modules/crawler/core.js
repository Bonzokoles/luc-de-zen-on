// Crawler Agent - Web Scraping and Data Extraction Module
// Advanced web crawling with respect for robots.txt and rate limiting

export class WebCrawlerManager {
  constructor() {
    this.crawlQueue = [];
    this.visitedUrls = new Set();
    this.crawlResults = new Map();
    this.crawlSettings = {
      maxDepth: 3,
      maxPages: 100,
      delayBetweenRequests: 1000, // ms
      respectRobotsTxt: true,
      followRedirects: true,
      maxRedirects: 5,
      timeout: 30000, // 30 seconds
      userAgent: 'MyBonzo-Crawler/1.0',
      maxConcurrentRequests: 3
    };
    
    this.activeRequests = 0;
    this.crawlStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      startTime: null,
      endTime: null
    };
    
    this.dataExtractors = {
      links: this.extractLinks.bind(this),
      images: this.extractImages.bind(this),
      text: this.extractText.bind(this),
      metadata: this.extractMetadata.bind(this),
      forms: this.extractForms.bind(this),
      tables: this.extractTables.bind(this),
      contacts: this.extractContacts.bind(this),
      social: this.extractSocialLinks.bind(this)
    };
    
    this.robotsCache = new Map();
    this.initialize();
  }
  
  initialize() {
    console.log('Web Crawler Manager initialized');
  }
  
  async crawlWebsite(startUrl, options = {}) {
    try {
      // Merge options with defaults
      const settings = { ...this.crawlSettings, ...options };
      
      // Reset stats
      this.crawlStats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        startTime: new Date(),
        endTime: null
      };
      
      // Clear previous results
      this.visitedUrls.clear();
      this.crawlResults.clear();
      this.crawlQueue = [];
      
      // Add start URL to queue
      this.crawlQueue.push({
        url: startUrl,
        depth: 0,
        referrer: null
      });
      
      this.onCrawlStart?.(startUrl, settings);
      
      // Process queue
      while (this.crawlQueue.length > 0 && this.visitedUrls.size < settings.maxPages) {
        const batch = this.crawlQueue.splice(0, settings.maxConcurrentRequests);
        
        const promises = batch.map(item => this.crawlPage(item, settings));
        await Promise.allSettled(promises);
        
        // Delay between batches
        if (this.crawlQueue.length > 0) {
          await this.delay(settings.delayBetweenRequests);
        }
      }
      
      this.crawlStats.endTime = new Date();
      this.onCrawlComplete?.(this.getCrawlSummary());
      
      return this.getCrawlResults();
      
    } catch (error) {
      console.error('Crawl failed:', error);
      this.onCrawlError?.(error);
      throw error;
    }
  }
  
  async crawlPage(item, settings) {
    const { url, depth, referrer } = item;
    
    try {
      // Check if already visited
      if (this.visitedUrls.has(url)) {
        return;
      }
      
      // Check depth limit
      if (depth > settings.maxDepth) {
        return;
      }
      
      // Check robots.txt if required
      if (settings.respectRobotsTxt && !(await this.isAllowedByRobots(url))) {
        console.log(`Blocked by robots.txt: ${url}`);
        return;
      }
      
      this.visitedUrls.add(url);
      this.crawlStats.totalRequests++;
      this.activeRequests++;
      
      this.onPageStart?.(url, depth);
      
      // Fetch page (simulated - in real implementation would use fetch/axios)
      const pageData = await this.fetchPage(url, settings);
      
      if (pageData) {
        // Extract data using registered extractors
        const extractedData = {};
        for (const [extractorName, extractor] of Object.entries(this.dataExtractors)) {
          try {
            extractedData[extractorName] = await extractor(pageData.content, url);
          } catch (error) {
            console.warn(`Extractor ${extractorName} failed for ${url}:`, error);
            extractedData[extractorName] = null;
          }
        }
        
        const result = {
          url,
          depth,
          referrer,
          status: pageData.status,
          title: pageData.title,
          contentType: pageData.contentType,
          contentLength: pageData.contentLength,
          lastModified: pageData.lastModified,
          extractedData,
          crawledAt: new Date().toISOString()
        };
        
        this.crawlResults.set(url, result);
        this.crawlStats.successfulRequests++;
        
        // Add found links to queue
        if (extractedData.links && depth < settings.maxDepth) {
          for (const link of extractedData.links) {
            if (!this.visitedUrls.has(link.href) && this.isValidUrl(link.href)) {
              this.crawlQueue.push({
                url: link.href,
                depth: depth + 1,
                referrer: url
              });
            }
          }
        }
        
        this.onPageComplete?.(url, result);
      } else {
        this.crawlStats.failedRequests++;
        this.onPageError?.(url, 'Failed to fetch page');
      }
      
    } catch (error) {
      this.crawlStats.failedRequests++;
      this.onPageError?.(url, error);
    } finally {
      this.activeRequests--;
    }
  }
  
  // Simulated page fetching (in real implementation would use fetch/puppeteer)
  async fetchPage(url, settings) {
    try {
      // Simulate network delay
      await this.delay(100 + Math.random() * 200);
      
      // Simulate different response types
      const mockResponses = {
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Sample Page - ${url}</title>
              <meta name="description" content="This is a sample page">
              <meta name="keywords" content="sample, test, crawler">
            </head>
            <body>
              <h1>Welcome to ${url}</h1>
              <p>This is sample content for crawling.</p>
              <a href="${url}/page1">Link 1</a>
              <a href="${url}/page2">Link 2</a>
              <img src="${url}/image.jpg" alt="Sample image">
              <form action="/submit" method="post">
                <input type="text" name="query" placeholder="Search...">
                <button type="submit">Submit</button>
              </form>
              <table>
                <tr><th>Name</th><th>Value</th></tr>
                <tr><td>Item 1</td><td>100</td></tr>
                <tr><td>Item 2</td><td>200</td></tr>
              </table>
              <div class="contact">
                Email: contact@example.com
                Phone: +48 123 456 789
              </div>
            </body>
          </html>
        `
      };
      
      return {
        status: 200,
        title: `Sample Page - ${url}`,
        content: mockResponses.html,
        contentType: 'text/html',
        contentLength: mockResponses.html.length,
        lastModified: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      return null;
    }
  }
  
  // Data extraction methods
  extractLinks(html, baseUrl) {
    const links = [];
    const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = this.resolveUrl(match[1], baseUrl);
      const text = match[2].trim();
      
      if (href) {
        links.push({
          href,
          text,
          internal: this.isInternalLink(href, baseUrl)
        });
      }
    }
    
    return links;
  }
  
  extractImages(html, baseUrl) {
    const images = [];
    const imageRegex = /<img\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*(?:alt\s*=\s*["']([^"']*)["'])?[^>]*>/gi;
    let match;
    
    while ((match = imageRegex.exec(html)) !== null) {
      const src = this.resolveUrl(match[1], baseUrl);
      const alt = match[2] || '';
      
      if (src) {
        images.push({
          src,
          alt,
          internal: this.isInternalLink(src, baseUrl)
        });
      }
    }
    
    return images;
  }
  
  extractText(html) {
    // Remove scripts and styles
    let text = html.replace(/<(script|style)[^>]*>.*?<\/\1>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Extract headings separately
    const headings = [];
    const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].trim()
      });
    }
    
    return {
      fullText: text,
      headings,
      wordCount: text.split(' ').length,
      characterCount: text.length
    };
  }
  
  extractMetadata(html) {
    const metadata = {};
    
    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }
    
    // Meta tags
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match;
    
    while ((match = metaRegex.exec(html)) !== null) {
      const attrs = match[1];
      const nameMatch = attrs.match(/name\s*=\s*["']([^"']+)["']/i);
      const contentMatch = attrs.match(/content\s*=\s*["']([^"']+)["']/i);
      
      if (nameMatch && contentMatch) {
        metadata[nameMatch[1].toLowerCase()] = contentMatch[1];
      }
    }
    
    return metadata;
  }
  
  extractForms(html, baseUrl) {
    const forms = [];
    const formRegex = /<form\s+([^>]+)>(.*?)<\/form>/gis;
    let match;
    
    while ((match = formRegex.exec(html)) !== null) {
      const attrs = match[1];
      const content = match[2];
      
      const actionMatch = attrs.match(/action\s*=\s*["']([^"']+)["']/i);
      const methodMatch = attrs.match(/method\s*=\s*["']([^"']+)["']/i);
      
      // Extract form inputs
      const inputs = [];
      const inputRegex = /<input\s+([^>]+)>/gi;
      let inputMatch;
      
      while ((inputMatch = inputRegex.exec(content)) !== null) {
        const inputAttrs = inputMatch[1];
        const typeMatch = inputAttrs.match(/type\s*=\s*["']([^"']+)["']/i);
        const nameMatch = inputAttrs.match(/name\s*=\s*["']([^"']+)["']/i);
        
        inputs.push({
          type: typeMatch ? typeMatch[1] : 'text',
          name: nameMatch ? nameMatch[1] : '',
          attributes: inputAttrs
        });
      }
      
      forms.push({
        action: actionMatch ? this.resolveUrl(actionMatch[1], baseUrl) : baseUrl,
        method: methodMatch ? methodMatch[1].toUpperCase() : 'GET',
        inputs
      });
    }
    
    return forms;
  }
  
  extractTables(html) {
    const tables = [];
    const tableRegex = /<table[^>]*>(.*?)<\/table>/gis;
    let match;
    
    while ((match = tableRegex.exec(html)) !== null) {
      const tableContent = match[1];
      const rows = [];
      
      const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
      let rowMatch;
      
      while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
        const rowContent = rowMatch[1];
        const cells = [];
        
        const cellRegex = /<t[hd][^>]*>([^<]*)<\/t[hd]>/gi;
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
          cells.push(cellMatch[1].trim());
        }
        
        if (cells.length > 0) {
          rows.push(cells);
        }
      }
      
      if (rows.length > 0) {
        tables.push({
          rows,
          rowCount: rows.length,
          columnCount: rows[0] ? rows[0].length : 0
        });
      }
    }
    
    return tables;
  }
  
  extractContacts(html) {
    const contacts = {
      emails: [],
      phones: [],
      addresses: []
    };
    
    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex) || [];
    contacts.emails = [...new Set(emails)];
    
    // Extract phone numbers
    const phoneRegex = /(\+?[0-9]{1,4}[-.\s]?)?(\(?[0-9]{1,3}\)?[-.\s]?)?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g;
    const phones = html.match(phoneRegex) || [];
    contacts.phones = [...new Set(phones)];
    
    return contacts;
  }
  
  extractSocialLinks(html, baseUrl) {
    const socialLinks = [];
    const socialPlatforms = {
      'facebook.com': 'Facebook',
      'twitter.com': 'Twitter',
      'x.com': 'X (Twitter)',
      'linkedin.com': 'LinkedIn',
      'instagram.com': 'Instagram',
      'youtube.com': 'YouTube',
      'tiktok.com': 'TikTok',
      'github.com': 'GitHub'
    };
    
    const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const url = match[1];
      
      for (const [domain, platform] of Object.entries(socialPlatforms)) {
        if (url.includes(domain)) {
          socialLinks.push({
            platform,
            url: this.resolveUrl(url, baseUrl)
          });
          break;
        }
      }
    }
    
    return socialLinks;
  }
  
  // Utility methods
  resolveUrl(url, baseUrl) {
    try {
      if (url.startsWith('http')) {
        return url;
      }
      return new URL(url, baseUrl).href;
    } catch (error) {
      return null;
    }
  }
  
  isInternalLink(url, baseUrl) {
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(baseUrl);
      return urlObj.hostname === baseUrlObj.hostname;
    } catch (error) {
      return false;
    }
  }
  
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async isAllowedByRobots(url) {
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
      
      if (this.robotsCache.has(robotsUrl)) {
        const robotsRules = this.robotsCache.get(robotsUrl);
        return this.checkRobotsRules(robotsRules, url);
      }
      
      // In real implementation, would fetch robots.txt
      // For now, return true (allowed)
      return true;
      
    } catch (error) {
      return true; // Allow if robots.txt check fails
    }
  }
  
  checkRobotsRules(robotsRules, url) {
    // Simplified robots.txt checking
    // In real implementation would parse robots.txt properly
    return true;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getCrawlResults() {
    return Array.from(this.crawlResults.values());
  }
  
  getCrawlSummary() {
    const duration = this.crawlStats.endTime ? 
      this.crawlStats.endTime.getTime() - this.crawlStats.startTime.getTime() : 0;
    
    return {
      ...this.crawlStats,
      duration,
      pagesVisited: this.visitedUrls.size,
      uniqueUrls: this.crawlResults.size,
      successRate: this.crawlStats.totalRequests > 0 ? 
        (this.crawlStats.successfulRequests / this.crawlStats.totalRequests * 100).toFixed(2) + '%' : '0%'
    };
  }
  
  exportResults(format = 'json') {
    const results = this.getCrawlResults();
    
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(results, null, 2);
      
      case 'csv':
        if (results.length === 0) return '';
        
        const headers = ['url', 'title', 'status', 'depth', 'wordCount'];
        const rows = results.map(result => [
          result.url,
          result.title || '',
          result.status,
          result.depth,
          result.extractedData?.text?.wordCount || 0
        ]);
        
        return [headers, ...rows].map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
      
      default:
        return results;
    }
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.WebCrawlerManager = WebCrawlerManager;
}