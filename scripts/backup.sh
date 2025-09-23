#!/bin/bash

# 🔒 BACKUP SCRIPT - MyBonzo Application
# Automatyczny backup przed deploymentem i codziennie

set -e

# Konfiguracja
BACKUP_DIR="./backups"
PROJECT_NAME="luc-de-zen-on"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="backup_${DATE}"

# Kolory dla outputu
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting backup process...${NC}"

# Tworzenie katalogu backupów
mkdir -p "${BACKUP_DIR}/daily"
mkdir -p "${BACKUP_DIR}/manual"
mkdir -p "${BACKUP_DIR}/pre-deploy"

# Backup kodu źródłowego
echo -e "${YELLOW}📦 Creating source code backup...${NC}"
git archive --format=zip --output="${BACKUP_DIR}/manual/${BACKUP_NAME}_source.zip" HEAD

# Backup bazy danych KV (jeśli dostępne)
echo -e "${YELLOW}🗄️ Backing up KV stores...${NC}"
if command -v wrangler &> /dev/null; then
    # Backup SESSION KV
    wrangler kv:bulk get --binding SESSION --preview false > "${BACKUP_DIR}/manual/${BACKUP_NAME}_kv_session.json" 2>/dev/null || echo "SESSION KV not found or empty"
    
    # Backup AGENTS KV
    wrangler kv:bulk get --binding AGENTS --preview false > "${BACKUP_DIR}/manual/${BACKUP_NAME}_kv_agents.json" 2>/dev/null || echo "AGENTS KV not found or empty"
    
    # Backup AI_AGENTS KV
    wrangler kv:bulk get --binding AI_AGENTS --preview false > "${BACKUP_DIR}/manual/${BACKUP_NAME}_kv_ai_agents.json" 2>/dev/null || echo "AI_AGENTS KV not found or empty"
else
    echo -e "${RED}⚠️ Wrangler not found, skipping KV backup${NC}"
fi

# Backup konfiguracji
echo -e "${YELLOW}⚙️ Backing up configuration files...${NC}"
tar -czf "${BACKUP_DIR}/manual/${BACKUP_NAME}_config.tar.gz" \
    package.json \
    package-lock.json \
    astro.config.mjs \
    wrangler.jsonc \
    tailwind.config.mjs \
    tsconfig.json \
    .env.example \
    2>/dev/null || echo "Some config files not found"

# Tworzenie manifestu backupu
echo -e "${YELLOW}📝 Creating backup manifest...${NC}"
cat > "${BACKUP_DIR}/manual/${BACKUP_NAME}_manifest.json" << EOF
{
  "backup_name": "${BACKUP_NAME}",
  "created_at": "$(date -Iseconds)",
  "git_commit": "$(git rev-parse HEAD)",
  "git_branch": "$(git rev-parse --abbrev-ref HEAD)",
  "files": [
    "${BACKUP_NAME}_source.zip",
    "${BACKUP_NAME}_kv_session.json",
    "${BACKUP_NAME}_kv_agents.json",
    "${BACKUP_NAME}_kv_ai_agents.json",
    "${BACKUP_NAME}_config.tar.gz"
  ],
  "backup_type": "manual",
  "project": "${PROJECT_NAME}"
}
EOF

# Sprawdzenie rozmiaru backupu
BACKUP_SIZE=$(du -sh "${BACKUP_DIR}/manual" | cut -f1)
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
echo -e "📊 Backup location: ${BACKUP_DIR}/manual"
echo -e "📊 Backup size: ${BACKUP_SIZE}"
echo -e "🏷️ Backup name: ${BACKUP_NAME}"

# Czyszczenie starych backupów (zachowaj ostatnie 10)
echo -e "${YELLOW}🧹 Cleaning old backups...${NC}"
cd "${BACKUP_DIR}/manual"
ls -t backup_*_manifest.json 2>/dev/null | tail -n +11 | while read manifest; do
    backup_prefix=$(basename "$manifest" _manifest.json)
    echo "Removing old backup: $backup_prefix"
    rm -f "${backup_prefix}"*
done
cd - > /dev/null

echo -e "${GREEN}🎉 Backup process completed!${NC}"

# Return backup name for scripts
echo "${BACKUP_NAME}"