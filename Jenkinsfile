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
    }

    stages {

        stage('Checkout') {
            steps {
                echo '===== CHECKOUT DU PROJET ====='
                checkout scm
            }
        }

        stage('Environment') {
            steps {
                echo '===== VERIFICATION ENVIRONNEMENT ====='

                sh '''
                    set -e

                    echo "Node.js :"
                    node --version

                    echo "npm :"
                    npm --version

                    echo "Git :"
                    git --version

                    echo "Java :"
                    java -version || true

                    echo "Chromium :"
                    chromium --version || true
                '''
            }
        }

        stage('Installation') {
            steps {
                echo '===== INSTALLATION DES DEPENDANCES ====='

                sh '''
                    set -e

                    npm ci \
                        --cache /var/jenkins_home/.npm-cache \
                        --prefer-offline \
                        --no-audit \
                        --no-fund
                '''
            }
        }

        stage('Tests unitaires') {
            steps {
                echo '===== TESTS UNITAIRES ====='

                sh '''
                    set -e
                    npm run test:unit
                '''
            }
        }

        stage('Tests API') {
            steps {
                echo '===== TESTS API / INTEGRATION ====='

                sh '''
                    set -e
                    npm run test:integration
                '''
            }
        }

        stage('Coverage') {
            steps {
                echo '===== COVERAGE ====='

                sh '''
                    set -e

                    rm -rf coverage

                    npm run test:coverage

                    if [ ! -f coverage/lcov.info ]; then
                        echo "ERREUR : coverage/lcov.info introuvable"
                        exit 1
                    fi

                    echo "Rapport LCOV genere avec succes"
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
            steps {
                echo '===== ANALYSE SONARQUBE ====='

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            set -e

                            echo "Node.js utilise par Jenkins :"
                            node --version

                            echo "npm :"
                            npm --version

                            echo "Lancement de SonarScanner..."

                            ${scannerHome}/bin/sonar-scanner

                            echo "Analyse SonarQube terminee avec succes."
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo '===== QUALITY GATE SONARQUBE ====='

                script {
                    timeout(time: 10, unit: 'MINUTES') {

                        def qualityGate = waitForQualityGate()

                        echo "Statut Quality Gate : ${qualityGate.status}"

                        if (qualityGate.status != 'OK') {
                            error(
                                "Quality Gate SonarQube non conforme : " +
                                qualityGate.status
                            )
                        }

                        echo "Quality Gate SonarQube : OK"
                    }
                }
            }
        }
    }

    post {

        success {
            echo '''
========================================
       SHOPNOW CI - BUILD SUCCESS
========================================

Checkout              : OK
Environnement         : OK
Installation npm      : OK
Tests unitaires       : OK
Tests API             : OK
Coverage              : OK
SonarQube             : OK
Quality Gate          : OK

========================================
       PIPELINE TERMINE AVEC SUCCES
========================================
'''
        }

        failure {
            echo '''
========================================
       SHOPNOW CI - BUILD FAILURE
========================================

Une etape du pipeline a echoue.

Consultez les logs Jenkins pour
identifier l'etape en erreur.

========================================
'''
        }

        aborted {
            echo '''
========================================
       SHOPNOW CI - BUILD ABORTED
========================================

Le pipeline a ete interrompu ou
un timeout a ete atteint.

========================================
'''
        }

        always {
            echo '===== FIN DU PIPELINE ====='
        }
    }
}