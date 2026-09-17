FROM jenkins/jenkins:lts-jdk21

USER root

# Outils nécessaires au pipeline
RUN apt-get update && \
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        chromium \
        git \
        docker.io && \
    rm -rf /var/lib/apt/lists/*

# Installation de Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Vérifications
RUN node --version && \
    npm --version && \
    chromium --version && \
    git --version

USER jenkins