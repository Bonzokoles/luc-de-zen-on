#!/usr/bin/env python3

import asyncio
import subprocess
import os
import sys
from pathlib import Path

class PolaczekDeployManager:
    def __init__(self):
        self.project_dir = Path("T:/MY_LUC_ZEN_ON")
        self.worker_file = self.project_dir / "src/workers/polaczek-websocket.js"
        self.wrangler_config = self.project_dir / "wrangler-polaczek.toml"

    def check_wrangler_installed(self):
        """Check if Wrangler CLI is available via npx"""
        try:
            result = subprocess.run(['npx', 'wrangler', '--version'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Wrangler available via npx: {result.stdout.strip()}")
                return True
            else:
                print("❌ Wrangler not available via npx")
                return False
        except FileNotFoundError:
            print("❌ npx not found")
            return False

    def deploy_worker(self):
        """Deploy the WebSocket worker to Cloudflare using npx"""
        if not self.check_wrangler_installed():
            print("📦 Wrangler not available via npx, checking local installation...")
            # Try to install wrangler locally if not available
            subprocess.run(['npm', 'install', 'wrangler'], check=True)
        
        print("🚀 Deploying POLACZEK WebSocket Worker...")
        
        try:
            # Change to project directory
            os.chdir(self.project_dir)
            
            # Deploy using npx wrangler
            result = subprocess.run([
                'npx', 'wrangler', 'deploy', 
                '--config', str(self.wrangler_config),
                '--compatibility-date', '2024-01-01'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ POLACZEK Worker deployed successfully!")
                print(f"🔗 Worker URL: {self.extract_worker_url(result.stdout)}")
                return True
            else:
                print(f"❌ Deployment failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error during deployment: {e}")
            return False

    def extract_worker_url(self, output):
        """Extract worker URL from wrangler output"""
        lines = output.split('\n')
        for line in lines:
            if 'worker.dev' in line or 'pages.dev' in line:
                return line.strip()
        return "Check Cloudflare dashboard for worker URL"

    def test_websocket(self):
        """Test WebSocket connection"""
        print("🧪 Testing WebSocket connection...")
        # This would require websocket client - placeholder for now
        print("WebSocket test placeholder - implement with websocket client library")

    def run(self):
        """Main deployment process"""
        print("🔧 POLACZEK WebSocket Worker Deployment")
        print("=" * 50)
        
        if not self.worker_file.exists():
            print(f"❌ Worker file not found: {self.worker_file}")
            return False
            
        if not self.wrangler_config.exists():
            print(f"❌ Wrangler config not found: {self.wrangler_config}")
            return False
        
        print(f"📁 Project directory: {self.project_dir}")
        print(f"📄 Worker file: {self.worker_file}")
        print(f"⚙️ Config file: {self.wrangler_config}")
        
        success = self.deploy_worker()
        
        if success:
            print("\n✅ Deployment completed successfully!")
            print("🔗 Update your frontend to use the worker WebSocket URL")
            print("📊 Check Cloudflare dashboard for worker logs and analytics")
        else:
            print("\n❌ Deployment failed - check error messages above")
            
        return success

if __name__ == "__main__":
    print("🚀 Starting POLACZEK WebSocket Worker Deployment...")
    print("📍 This will deploy WebSocket proxy to Cloudflare Workers")
    print("-" * 50)
    
    manager = PolaczekDeployManager()
    success = manager.run()
    
    if success:
        print("\n🎉 POLACZEK WebSocket Worker is now live on Cloudflare!")
    else:
        print("\n💥 Deployment failed - check configuration and try again")
        sys.exit(1)
