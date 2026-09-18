pipeline {

    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        CI = 'true'
        SONAR_PROJECT_KEY = 'shopnow'
        SONAR_PROJECT_NAME = 'ShopNow Test Platform'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'Checkout du projet'
                echo '======================================'

                checkout scm
            }
        }

        stage('Environment') {
            steps {
                echo '======================================'
                echo 'Vérification de l’environnement'
                echo '======================================'

                sh '''
                    set -e

                    echo "Node.js :"
                    node --version

                    echo ""
                    echo "npm :"
                    npm --version

                    echo ""
                    echo "Git :"
                    git --version

                    echo ""
                    echo "Java :"
                    java -version || true

                    echo ""
                    echo "Chromium :"
                    chromium --version || google-chrome --version || true
                '''
            }
        }

        stage('Installation') {
            steps {
                echo '======================================'
                echo 'Installation des dépendances'
                echo '======================================'

                sh '''
                    set -e

                    if [ -f package-lock.json ]; then
                        npm ci \
                            --cache /var/jenkins_home/.npm-cache \
                            --prefer-offline \
                            --no-audit \
                            --no-fund
                    else
                        npm install \
                            --no-audit \
                            --no-fund
                    fi
                '''
            }
        }

        stage('Tests unitaires') {
            steps {
                echo '======================================'
                echo 'Tests unitaires'
                echo '======================================'

                sh '''
                    set -e
                    npm run test:unit
                '''
            }
        }

        stage('Tests API') {
            steps {
                echo '======================================'
                echo 'Tests API / intégration'
                echo '======================================'

                sh '''
                    set -e
                    npm run test:integration
                '''
            }
        }

        stage('Coverage') {
            steps {
                echo '======================================'
                echo 'Calcul de la couverture'
                echo '======================================'

                sh '''
                    set -e

                    rm -rf coverage

                    npm run test:coverage

                    if [ ! -f coverage/lcov.info ]; then
                        echo "ERREUR : coverage/lcov.info introuvable."
                        exit 1
                    fi

                    echo "Rapport LCOV généré."
                    ls -lh coverage/lcov.info
                '''
            }

            post {
                always {
                    archiveArtifacts(
                        artifacts: 'coverage/**',
                        allowEmptyArchive: true,
                        fingerprint: true
                    )
                }
            }
        }

        stage('SonarQube') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }

            steps {
                echo '======================================'
                echo 'Analyse SonarQube'
                echo '======================================'

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            set -e

                            echo "Node.js utilisé :"
                            node --version

                            echo "npm :"
                            npm --version

                            echo "Lancement de SonarScanner..."

                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            options {
                timeout(time: 5, unit: 'MINUTES')
            }

            steps {
                echo '======================================'
                echo 'Quality Gate SonarQube'
                echo '======================================'

                script {
                    def qualityGate = waitForQualityGate()

                    echo "Quality Gate : ${qualityGate.status}"

                    if (qualityGate.status != 'OK') {
                        error "Quality Gate SonarQube non conforme : ${qualityGate.status}"
                    }
                }
            }
        }
    }

    post {

        success {
            echo '''
======================================
BUILD SUCCESS
======================================
ShopNow CI terminé avec succès.

Étapes validées :
- Checkout
- Environment
- Installation
- Tests unitaires
- Tests API
- Coverage
- SonarQube
- Quality Gate
======================================
'''
        }

        failure {
            echo '''
======================================
BUILD FAILURE
======================================
Une ou plusieurs étapes du pipeline ont échoué.
Consulter les logs Jenkins.
======================================
'''
        }

        always {
            echo 'Build terminé.'
        }
    }
}