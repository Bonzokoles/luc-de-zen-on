import { promises as fs } from 'fs';
import path from 'path';
import { documentationIndex, findRelevantDocs } from './documentationIndex.js';

// Documentation Reader for POLACZEK AI Assistant
export class DocumentationReader {
    constructor() {
        this.docsPath = path.join(process.cwd(), 'src', 'docs');
        this.cache = new Map();
    }

    // Read specific documentation file
    async readDocumentation(filename) {
        try {
            if (this.cache.has(filename)) {
                return this.cache.get(filename);
            }

            const filePath = path.join(this.docsPath, filename);
            const content = await fs.readFile(filePath, 'utf-8');

            // Cache the content
            this.cache.set(filename, content);
            return content;
        } catch (error) {
            console.error(`Error reading documentation file ${filename}:`, error);
            return null;
        }
    }

    // Find and read relevant documentation based on query
    async findAndReadRelevantDocs(query, maxDocs = 3) {
        const relevantDocs = findRelevantDocs(query);
        const docContents = [];

        for (let i = 0; i < Math.min(relevantDocs.length, maxDocs); i++) {
            const doc = relevantDocs[i];

            if (doc.files) {
                // Multiple files for this category
                for (const filename of doc.files.slice(0, 2)) { // Limit to 2 files per category
                    const content = await this.readDocumentation(filename);
                    if (content) {
                        docContents.push({
                            title: doc.title,
                            filename: filename,
                            content: this.extractRelevantSection(content, query),
                            relevanceScore: doc.relevanceScore
                        });
                    }
                }
            } else if (doc.file) {
                // Single file
                const content = await this.readDocumentation(doc.file);
                if (content) {
                    docContents.push({
                        title: doc.title,
                        filename: doc.file,
                        content: this.extractRelevantSection(content, query),
                        relevanceScore: doc.relevanceScore
                    });
                }
            }
        }

        return docContents;
    }

    // Extract most relevant section from documentation
    extractRelevantSection(content, query, maxLength = 1000) {
        if (!content || content.length <= maxLength) {
            return content;
        }

        const queryLower = query.toLowerCase();
        const lines = content.split('\n');
        const relevantLines = [];
        let foundRelevant = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineContainsQuery = line.toLowerCase().includes(queryLower);

            if (lineContainsQuery) {
                // Found relevant line, add context before and after
                const startContext = Math.max(0, i - 5);
                const endContext = Math.min(lines.length - 1, i + 10);

                for (let j = startContext; j <= endContext; j++) {
                    if (!relevantLines.includes(lines[j])) {
                        relevantLines.push(lines[j]);
                    }
                }
                foundRelevant = true;
            }
        }

        if (!foundRelevant) {
            // If no direct match, return first portion
            return lines.slice(0, 20).join('\n') + '...';
        }

        const result = relevantLines.join('\n');
        if (result.length > maxLength) {
            return result.substring(0, maxLength) + '...';
        }

        return result;
    }

    // Get documentation summary for a specific category
    async getDocumentationSummary(category) {
        const doc = documentationIndex[category];
        if (!doc) return null;

        const summary = {
            title: doc.title,
            description: doc.description,
            keywords: doc.keywords,
            files: []
        };

        if (doc.files) {
            for (const filename of doc.files) {
                const content = await this.readDocumentation(filename);
                if (content) {
                    summary.files.push({
                        filename,
                        preview: content.substring(0, 200) + '...'
                    });
                }
            }
        } else if (doc.file) {
            const content = await this.readDocumentation(doc.file);
            if (content) {
                summary.files.push({
                    filename: doc.file,
                    preview: content.substring(0, 200) + '...'
                });
            }
        }

        return summary;
    }

    // Search across all documentation
    async searchAllDocumentation(query, maxResults = 5) {
        const results = [];

        for (const [category, doc] of Object.entries(documentationIndex)) {
            const files = doc.files || [doc.file];

            for (const filename of files) {
                if (!filename) continue;

                const content = await this.readDocumentation(filename);
                if (content && content.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        category,
                        title: doc.title,
                        filename,
                        relevantSection: this.extractRelevantSection(content, query),
                        matchScore: this.calculateMatchScore(content, query)
                    });
                }
            }
        }

        return results
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, maxResults);
    }

    calculateMatchScore(content, query) {
        const contentLower = content.toLowerCase();
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(' ');

        let score = 0;

        // Count exact phrase matches
        const phraseMatches = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
        score += phraseMatches * 10;

        // Count individual word matches
        queryWords.forEach(word => {
            const wordMatches = (contentLower.match(new RegExp('\\b' + word + '\\b', 'g')) || []).length;
            score += wordMatches * 2;
        });

        return score;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Export singleton instance
export const documentationReader = new DocumentationReader();