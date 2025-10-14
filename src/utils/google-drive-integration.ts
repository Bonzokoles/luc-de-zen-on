/**
 * Google Drive API Integration for MyBonzo AI System
 * Real integration with Google Drive API v3
 */

interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink: string;
  downloadUrl?: string;
  content?: string;
}

interface DriveSearchResult {
  files: DriveFile[];
  totalFiles: number;
  totalSize: number;
  categories: Record<string, number>;
}

export class GoogleDriveIntegration {
  private config: GoogleDriveConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config: GoogleDriveConfig) {
    this.config = config;
  }

  /**
   * Step 1: Get authorization URL for OAuth2 flow
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Step 2: Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(authorizationCode: string): Promise<any> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: authorizationCode,
        grant_type: "authorization_code",
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const tokens = (await response.json()) as any;
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;

    return tokens;
  }

  /**
   * Step 3: Refresh access token when expired
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokens = (await response.json()) as any;
    this.accessToken = tokens.access_token;

    return this.accessToken!;
  }

  /**
   * Step 4: Search files in Google Drive
   */
  async searchFiles(
    query: string = "",
    maxResults: number = 100
  ): Promise<DriveSearchResult> {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Call exchangeCodeForTokens first.");
    }

    const searchQuery = query ? `name contains '${query}'` : "";
    const params = new URLSearchParams({
      q: searchQuery,
      pageSize: maxResults.toString(),
      fields:
        "files(id,name,mimeType,size,modifiedTime,webViewLink),nextPageToken",
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();
        return this.searchFiles(query, maxResults);
      }
      throw new Error(`Drive API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const files: DriveFile[] = data.files || [];

    // Calculate statistics
    const totalSize = files.reduce(
      (sum, file) => sum + (parseInt(String(file.size || "0")) || 0),
      0
    );
    const categories = this.categorizeFiles(files);

    return {
      files,
      totalFiles: files.length,
      totalSize,
      categories,
    };
  }

  /**
   * Step 5: Get file content for AI analysis
   */
  async getFileContent(fileId: string): Promise<string> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    // First get file metadata
    const metaResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!metaResponse.ok) {
      throw new Error(
        `Failed to get file metadata: ${metaResponse.statusText}`
      );
    }

    const metadata = (await metaResponse.json()) as any;

    // Check if file is text-based
    if (!this.isTextFile(metadata.mimeType)) {
      throw new Error(
        `File type ${metadata.mimeType} is not supported for content extraction`
      );
    }

    // Download file content
    const contentResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!contentResponse.ok) {
      throw new Error(
        `Failed to download file content: ${contentResponse.statusText}`
      );
    }

    return await contentResponse.text();
  }

  /**
   * Step 6: Analyze Drive data for AI recommendations
   */
  async analyzeUserData(
    dataTypes: string[] = ["personal", "business"]
  ): Promise<string> {
    const analysisResults: string[] = [];

    for (const dataType of dataTypes) {
      try {
        let searchQuery = "";

        switch (dataType) {
          case "personal":
            searchQuery = "CV OR resume OR portfolio OR certificate";
            break;
          case "business":
            searchQuery = "business OR plan OR report OR analysis";
            break;
          case "technical":
            searchQuery = "code OR documentation OR config OR log";
            break;
        }

        const searchResult = await this.searchFiles(searchQuery, 20);

        // Analyze first few text files
        const textFiles = searchResult.files
          .filter((file) => this.isTextFile(file.mimeType))
          .slice(0, 5);

        for (const file of textFiles) {
          try {
            const content = await this.getFileContent(file.id);
            analysisResults.push(
              `${dataType.toUpperCase()} - ${file.name}: ${content.substring(
                0,
                200
              )}...`
            );
          } catch (error) {
            console.warn(`Failed to read file ${file.name}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${dataType} data:`, error);
        analysisResults.push(
          `${dataType.toUpperCase()}: Błąd dostępu do danych`
        );
      }
    }

    return analysisResults.join("\n\n");
  }

  /**
   * Helper: Check if file is text-based
   */
  private isTextFile(mimeType: string): boolean {
    const textTypes = [
      "text/plain",
      "text/html",
      "text/css",
      "text/javascript",
      "application/json",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.google-apps.document",
      "application/vnd.google-apps.spreadsheet",
    ];

    return textTypes.some((type) => mimeType.includes(type));
  }

  /**
   * Helper: Categorize files by type
   */
  private categorizeFiles(files: DriveFile[]): Record<string, number> {
    const categories: Record<string, number> = {
      documents: 0,
      images: 0,
      videos: 0,
      audio: 0,
      code: 0,
      other: 0,
    };

    files.forEach((file) => {
      const mimeType = file.mimeType.toLowerCase();

      if (
        mimeType.includes("document") ||
        mimeType.includes("text") ||
        mimeType.includes("pdf")
      ) {
        categories.documents++;
      } else if (mimeType.includes("image")) {
        categories.images++;
      } else if (mimeType.includes("video")) {
        categories.videos++;
      } else if (mimeType.includes("audio")) {
        categories.audio++;
      } else if (
        mimeType.includes("javascript") ||
        mimeType.includes("python") ||
        mimeType.includes("code")
      ) {
        categories.code++;
      } else {
        categories.other++;
      }
    });

    return categories;
  }

  /**
   * Get current authentication status
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Set tokens manually (for server-side usage)
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }
}

/**
 * Factory function to create Google Drive integration
 */
export function createGoogleDriveIntegration(env: any): GoogleDriveIntegration {
  const config: GoogleDriveConfig = {
    clientId: env.GOOGLE_CLIENT_ID || "your-client-id.googleusercontent.com",
    clientSecret: env.GOOGLE_CLIENT_SECRET || "your-client-secret",
    redirectUri:
      env.GOOGLE_REDIRECT_URI || "https://mybonzo.com/auth/google/callback",
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
    ],
  };

  return new GoogleDriveIntegration(config);
}

/**
 * Cloudflare Workers compatible version
 */
export async function getGoogleDriveData(
  env: any,
  dataTypes: string[] = []
): Promise<string> {
  try {
    // Check if we have stored tokens
    const accessToken = env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = env.GOOGLE_REFRESH_TOKEN;

    if (!accessToken) {
      return `GOOGLE DRIVE: Nie skonfigurowano. Wymagane zmienne:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET  
- GOOGLE_ACCESS_TOKEN
- GOOGLE_REFRESH_TOKEN

Instrukcje konfiguracji: /docs/google-drive-setup`;
    }

    const drive = createGoogleDriveIntegration(env);
    drive.setTokens(accessToken, refreshToken);

    // Analyze user data
    const analysisResult = await drive.analyzeUserData(dataTypes);

    return `PRAWDZIWE DANE Z GOOGLE DRIVE (2TB):\n${analysisResult}`;
  } catch (error) {
    console.error("Google Drive integration error:", error);
    return `GOOGLE DRIVE: Błąd połączenia - ${(error as any).message}`;
  }
}
