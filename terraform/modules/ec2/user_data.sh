#!/bin/bash
set -e

# Log everything
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user data script execution at $(date)"

# Update system
echo "Updating system packages..."
apt-get update -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    curl \
    git \
    build-essential \
    postgresql-client \
    nginx \
    jq \
    unzip

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Create application directory
echo "Creating application directory..."
APP_DIR="/home/ubuntu/app"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
echo "Cloning repository from ${github_repo_url}..."
git clone -b ${github_branch} ${github_repo_url} .

# Create .env file with database credentials
echo "Creating .env file..."
cat > .env << EOF
# Database Configuration
PGHOST=${db_host}
PGPORT=${db_port}
PGUSER=${db_username}
PGPASSWORD=${db_password}
PGDATABASE=${db_name}

# Application Configuration
NODE_ENV=production
PORT=8080

# Project Information
PROJECT_NAME=${project_name}
ENVIRONMENT=${environment}
EOF

# Set proper permissions
chown -R ubuntu:ubuntu $APP_DIR
chmod 600 .env

# Install dependencies
echo "Installing npm dependencies..."
sudo -u ubuntu npm install

# Build the application
echo "Building the application..."
sudo -u ubuntu npm run build

# Wait for database to be ready
echo "Waiting for database to be ready..."
until PGPASSWORD=${db_password} psql -h ${db_host} -U ${db_username} -d ${db_name} -c '\q' 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 5
done

echo "Database is ready!"

# Run database initialization scripts
echo "Running database initialization scripts..."
if [ -d "./db-scripts" ]; then
  for script in ./db-scripts/*.sql; do
    if [ -f "$script" ]; then
      echo "Running $script..."
      PGPASSWORD=${db_password} psql -h ${db_host} -U ${db_username} -d ${db_name} -f "$script" || echo "Warning: Script $script failed"
    fi
  done
fi

# Configure PM2 ecosystem
echo "Configuring PM2..."
cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/src/index.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: '/var/log/pm2/backend-error.log',
      out_file: '/var/log/pm2/backend-out.log',
      log_file: '/var/log/pm2/backend-combined.log',
      time: true
    },
    {
      name: 'worker',
      script: './dist/worker/worker.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/pm2/worker-error.log',
      out_file: '/var/log/pm2/worker-out.log',
      log_file: '/var/log/pm2/worker-combined.log',
      time: true
    }
  ]
};
EOFPM2

chown ubuntu:ubuntu ecosystem.config.js

# Create PM2 log directory
mkdir -p /var/log/pm2
chown -R ubuntu:ubuntu /var/log/pm2

# Start application with PM2
echo "Starting application with PM2..."
sudo -u ubuntu pm2 start ecosystem.config.js

# Save PM2 process list
sudo -u ubuntu pm2 save

# Setup PM2 startup script
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Configure Nginx as reverse proxy (optional, for additional layer)
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/default << 'EOFNGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:8080/health;
        access_log off;
    }
}
EOFNGINX

# Test and reload Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "User data script completed successfully at $(date)"
echo "Application should be running on port 8080"
echo "Check status with: sudo -u ubuntu pm2 status"
