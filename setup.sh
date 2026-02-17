#!/bin/bash

# ThreatOne - Pro Installation Script
# Target: Linux (Ubuntu/Debian)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}   ThreatOne | Pro Deployment Script         ${NC}"
echo -e "${BLUE}==============================================${NC}"

# Check sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Execute como sudo: sudo ./setup.sh${NC}"
  exit 1
fi

# Detect dependencies
echo -e "${YELLOW}[1/4] Checking System Dependencies...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Suite...${NC}"
    apt-get update && apt-get install -y docker.io docker-compose
fi

# Setup ENV
echo -e "${YELLOW}[2/4] Configuration...${NC}"
if [ ! -f .env ]; then
    read -p "Gemini API KEY: " API_KEY
    read -p "MySQL User (root): " DB_USER
    DB_USER=${DB_USER:-root}
    read -sp "MySQL Password: " DB_PASS
    echo ""
    
    # Try to find Docker Host IP
    HOST_IP=$(ip -4 addr show docker0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}' || echo "host.docker.internal")
    
    cat <<EOF > .env
API_KEY=$API_KEY
DB_HOST=$HOST_IP
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_NAME=sdkcti
EOF
    echo -e "${GREEN}.env created.${NC}"
else
    echo -e "${BLUE}.env exists. Skipping.${NC}"
    export $(grep -v '^#' .env | xargs)
fi

# Database Init
echo -e "${YELLOW}[3/4] Initializing Database...${NC}"
if command -v mysql &> /dev/null; then
    mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS sdkcti;" || echo -e "${RED}DB creation failed. Check credentials.${NC}"
    mysql -u $DB_USER -p$DB_PASS sdkcti < init.sql && echo -e "${GREEN}Database Ready!${NC}"
else
    echo -e "${RED}MySQL client not found. Install it: apt install mysql-client${NC}"
fi

# Container Launch
echo -e "${YELLOW}[4/4] Starting Platform...${NC}"
docker compose down || true
docker compose up --build -d

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}   DEPLOYMENT COMPLETE!                      ${NC}"
echo -e "${BLUE}   URL: http://localhost:5173                ${NC}"
echo -e "${GREEN}==============================================${NC}"
