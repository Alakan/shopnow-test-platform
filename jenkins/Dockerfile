FROM jenkins/jenkins:lts-jdk21

USER root

ARG NODE22_VERSION=22.19.0
ARG NODE18_VERSION=18.20.8
ARG NODE18_ARCH=x64

# ============================================================
# Outils système + navigateur
# ============================================================
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        xz-utils \
        chromium \
        git \
        firefox-esr && \
    rm -rf /var/lib/apt/lists/* /tmp/*

# ============================================================
# Installation du Docker CLI (après ajout du dépôt Docker)
# ============================================================
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/debian trixie stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/* /tmp/*

# ============================================================
# Node.js 22 : runtime applicatif (tests)
# ============================================================
RUN curl -fsSL "https://nodejs.org/dist/v${NODE22_VERSION}/node-v${NODE22_VERSION}-linux-x64.tar.xz" \
        -o /tmp/node22.tar.xz && \
    tar -xJf /tmp/node22.tar.xz -C /usr/local --strip-components=1 && \
    rm -f /tmp/node22.tar.xz && \
    ln -sf /usr/local/bin/node /usr/local/bin/nodejs

# ============================================================
# Node.js 18 : runtime dédié au scanner SonarQube
# ============================================================
RUN curl -fsSL "https://nodejs.org/dist/v${NODE18_VERSION}/node-v${NODE18_VERSION}-linux-${NODE18_ARCH}.tar.xz" \
        -o /tmp/node18.tar.xz && \
    mkdir -p /opt/node18 && \
    tar -xJf /tmp/node18.tar.xz -C /opt/node18 --strip-components=1 && \
    rm -f /tmp/node18.tar.xz

# ============================================================
# Vérification des versions
# ============================================================
RUN echo "========================================" && \
    echo "Versions installées dans Jenkins" && \
    echo "========================================" && \
    echo "Java:" && java -version && \
    echo "Node.js (tests):" && node --version && \
    echo "npm:" && npm --version && \
    echo "Node.js (analyseur SonarQube):" && /opt/node18/bin/node --version && \
    echo "Git:" && git --version && \
    echo "Chromium:" && chromium --version && \
    echo "Firefox:" && firefox --version && \
    echo "Docker CLI:" && docker --version && \
    echo "========================================"

RUN jenkins-plugin-cli --plugins \
    git \
    github \
    workflow-aggregator \
    pipeline-stage-view \
    credentials-binding \
    docker-workflow \
    sonar

USER jenkins
