FROM jenkins/jenkins:lts-jdk21

USER root

# ============================================================
# Outils système
# ============================================================
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        chromium \
        git && \
    rm -rf /var/lib/apt/lists/*

# ============================================================
# Installation de Node.js 22
# ============================================================
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# ============================================================
# Installation du Docker CLI
# ============================================================
RUN curl -fsSL https://download.docker.com/linux/debian/gpg \
        | gpg --dearmor -o /usr/share/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/debian trixie stable" \
        > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# ============================================================
# Vérification des versions
# ============================================================
RUN echo "========================================" && \
    echo "Versions installées dans Jenkins" && \
    echo "========================================" && \
    echo "Java:" && \
    java -version && \
    echo "Node.js:" && \
    node --version && \
    echo "npm:" && \
    npm --version && \
    echo "Git:" && \
    git --version && \
    echo "Chromium:" && \
    chromium --version && \
    echo "Docker CLI:" && \
    docker --version && \
    echo "========================================"

USER jenkins