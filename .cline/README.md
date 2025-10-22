# Cloudflare API Configuration for MCP Servers
# Set these environment variables before using Cloudflare MCP servers

# 1. Get your Cloudflare API Token:
#    - Go to https://dash.cloudflare.com/profile/api-tokens
#    - Create Custom Token with permissions:
#      * Zone:Zone:Read, Zone:Zone Settings:Read
#      * Account:Account Settings:Read
#      * Account:Cloudflare Workers:Edit

# 2. Get your Cloudflare Account ID:
#    - Go to https://dash.cloudflare.com/
#    - Copy Account ID from the right sidebar

# 3. Set environment variables:
# $env:CLOUDFLARE_API_TOKEN="your_token_here"
# $env:CLOUDFLARE_ACCOUNT_ID="your_account_id_here"

# Example:
# $env:CLOUDFLARE_API_TOKEN="1234567890abcdef1234567890abcdef12345678"
# $env:CLOUDFLARE_ACCOUNT_ID="1234567890abcdef1234567890abcdef"

# Or create .env file with:
# CLOUDFLARE_API_TOKEN=your_token_here
# CLOUDFLARE_ACCOUNT_ID=your_account_id_here