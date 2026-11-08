# JALSA SALANA NIGERIA — DEPLOYMENT & INSTALLATION GUIDE
**Domain:** `jalsasalana.ng`  
**Platform:** Next.js (Frontend) + Node.js/Express (API) + MySQL 8.0 (Database via Prisma ORM)

---

## 1. ARCHITECTURE OVERVIEW

The Jalsa Salana Nigeria digital publishing platform consists of three integrated tiers:

1. **MySQL Database:** Normalized relational schema (`prisma/schema.prisma`) running MySQL 8.0 / MariaDB 10.6+.
2. **Backend REST API (`apps/api`):** Express.js TypeScript application listening on `127.0.0.1:5000` handling authentication, editorial workflow, media uploads, and business logic.
3. **Frontend Application (`apps/web`):** Next.js 14 React TypeScript application running on `127.0.0.1:3000` serving both the public magazine and the administrative editorial CMS (`/admin`).

---

## 2. SYSTEM REQUIREMENTS

### Hardware Requirements
- **CPU:** 2 vCPU cores minimum (4 vCPU recommended for high peak Jalsa traffic)
- **RAM:** 4 GB RAM minimum (8 GB recommended)
- **Storage:** 40 GB+ NVMe SSD (scales with high-res photo archives and audio assets)
- **OS:** Ubuntu 22.04 LTS / Debian 12 / AlmaLinux 9 or cPanel with Node.js support

### Software Stack
- **Node.js:** v18.18+ or v20.x LTS
- **npm:** v9.x or v10.x
- **MySQL:** MySQL 8.0 or MariaDB 10.6+
- **Reverse Proxy:** Nginx 1.20+ with HTTP/2 and Gzip/Brotli compression
- **Process Manager:** PM2 (`npm install -g pm2`)
- **SSL Certificates:** Certbot / Let's Encrypt

---

## 3. STEP-BY-STEP INSTALLATION (UBUNTU / VPS)

### Step 1: System Package Update & Node.js Installation
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v  # Expected: v20.x
npm -v   # Expected: v10.x
```

### Step 2: MySQL Database Setup
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Log in to MySQL root
sudo mysql -u root -p
```
Execute SQL to create the database and dedicated user:
```sql
CREATE DATABASE jalsasalana_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jalsa_user'@'localhost' IDENTIFIED BY 'StrongJalsaDbPassword2026!';
GRANT ALL PRIVILEGES ON jalsasalana_db.* TO 'jalsa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Clone Repository & Install Monorepo Dependencies
```bash
cd /var/www
sudo git clone https://github.com/jalsanigeria/jalsasalana-platform.git jalsasalana
sudo chown -R $USER:$USER /var/www/jalsasalana
cd /var/www/jalsasalana

# Install all npm dependencies across workspace
npm install
```

### Step 4: Configure Environment Variables
Create `.env` in the repository root:
```env
# Database
DATABASE_URL="mysql://jalsa_user:StrongJalsaDbPassword2026!@localhost:3306/jalsasalana_db"

# Backend API
PORT=5000
NODE_ENV=production
API_URL=https://jalsasalana.ng/api/v1
FRONTEND_URL=https://jalsasalana.ng
JWT_SECRET="YOUR_RANDOM_64_CHAR_HEX_SECRET_STRING_KEY_GOES_HERE"
COOKIE_DOMAIN="jalsasalana.ng"

# Media Storage
UPLOAD_DIR=/var/www/jalsasalana/apps/api/uploads
MAX_FILE_SIZE_MB=25
```

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://jalsasalana.ng/api/v1
NEXT_PUBLIC_SITE_URL=https://jalsasalana.ng
```

### Step 5: Database Push & Seeding
```bash
# Push database schema
npx prisma db push

# Seed initial roles, superadmin, categories, scholars, and Jalsa editions
node prisma/seed/seed.js
```

### Step 6: Build All Packages & Frontend
```bash
# Build shared library
npm --workspace=packages/shared run build

# Build Next.js Web App
npm --workspace=apps/web run build
```

---

## 4. PM2 PROCESS MANAGER CONFIGURATION

Create `/var/www/jalsasalana/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'jalsa-api',
      cwd: '/var/www/jalsasalana',
      script: 'node',
      args: '-r ts-node/register apps/api/src/server.ts',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
    },
    {
      name: 'jalsa-web',
      cwd: '/var/www/jalsasalana/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '800M',
    },
  ],
};
```

Start the processes and enable system boot persistence:
```bash
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

---

## 5. NGINX REVERSE PROXY CONFIGURATION

Create `/etc/nginx/sites-available/jalsasalana.ng`:
```nginx
server {
    listen 80;
    server_name jalsasalana.ng www.jalsasalana.ng;

    # Maximum file upload size for high-res galleries
    client_max_body_size 35M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Uploads Static Assets
    location /uploads/ {
        alias /var/www/jalsasalana/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
    }

    # API Proxy to Express
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Frontend Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and acquire SSL:
```bash
sudo ln -s /etc/nginx/sites-available/jalsasalana.ng /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Issue Let's Encrypt SSL
sudo certbot --nginx -d jalsasalana.ng -d www.jalsasalana.ng
```

---

## 6. BACKUP & MAINTENANCE PROCEDURE

### Nightly Automated Database Backup
Create `/usr/local/bin/backup-jalsa.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/jalsasalana"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Dump MySQL database
mysqldump -u jalsa_user -p'StrongJalsaDbPassword2026!' jalsasalana_db | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Keep last 14 days of backups
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +14 -delete
```
Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-jalsa.sh
# Run every night at 2:30 AM
(crontab -l 2>/dev/null; echo "30 2 * * * /usr/local/bin/backup-jalsa.sh") | crontab -
```
