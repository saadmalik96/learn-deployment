#!/bin/bash

# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    gnupg \
    lsb-release

# Install Docker GPG key using the new method
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permissions to the Docker Compose binary
sudo chmod +x /usr/local/bin/docker-compose

# Verify Docker Compose installation
docker-compose --version

# Create a directory for your application
mkdir -p ~/myapp
cd ~/myapp

# Create docker-compose.yml file
cat > docker-compose.yml << EOF
version: '3'
services:
  saad-deploy-be:
    image: saadmalik96/saad-deploy-be:latest
    container_name: "saad-deploy-be"

  saad-deploy-fe:
    image: saadmalik96/saad-deploy-fe:latest
    container_name: "saad-deploy-fe"
    depends_on:
      - saad-deploy-be

  proxy:
    image: saadmalik96/proxy:latest
    container_name: "proxy"
    ports:
      - "80:80"
EOF

# Start Docker Compose services
sudo docker compose up

echo "Deployment completed successfully! Your application is accessible over HTTP."