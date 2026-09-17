FROM jenkins/jenkins:lts-jdk21

USER root

# Outils nécessaires pour le pipeline
RUN apt-get update && \
    apt-get install -y \
        docker.io \
        nodejs \
        npm \
        chromium \
        curl \
        git && \
    rm -rf /var/lib/apt/lists/*

# Vérification
RUN node --version && \
    npm --version && \
    chromium --version

USER jenkins