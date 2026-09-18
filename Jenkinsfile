```groovy
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

        // ============================================================
        // 1. CHECKOUT
        // ============================================================

        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'CHECKOUT DU PROJET'
                echo '======================================'

                checkout scm
            }
        }


        // ============================================================
        // 2. ENVIRONMENT
        // ============================================================

        stage('Environment') {
            steps {
                echo '======================================'
                echo 'VERIFICATION DE L ENVIRONNEMENT'
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

                    echo ""
                    echo "Workspace :"
                    pwd
                '''
            }
        }


        // ============================================================
        // 3. INSTALLATION
        // ============================================================

        stage('Installation') {
            steps {
                echo '======================================'
                echo 'INSTALLATION DES DEPENDANCES'
                echo '======================================'

                sh '''
                    set -e

                    if [ -f package-lock.json ]; then

                        echo "package-lock.json trouve"
                        echo "Execution de npm ci..."

                        npm ci \
                            --cache /var/jenkins_home/.npm-cache \
                            --prefer-offline \
                            --no-audit \
                            --no-fund

                    else

                        echo "package-lock.json absent"
                        echo "Execution de npm install..."

                        npm install \
                            --no-audit \
                            --no-fund

                    fi

                    echo ""
                    echo "Installation terminee."
                '''
            }
        }


        // ============================================================
        // 4. TESTS UNITAIRES
        // ============================================================

        stage('Tests unitaires') {
            steps {
                echo '======================================'
                echo 'TESTS UNITAIRES'
                echo '======================================'

                sh '''
                    set -e

                    npm run test:unit
                '''
            }
        }


        // ============================================================
        // 5. TESTS API / INTEGRATION
        // ============================================================

        stage('Tests API') {
            steps {
                echo '======================================'
                echo 'TESTS API / INTEGRATION'
                echo '======================================'

                sh '''
                    set -e

                    npm run test:integration
                '''
            }
        }


        // ============================================================
        // 6. COVERAGE
        // ============================================================

        stage('Coverage') {
            steps {
                echo '======================================'
                echo 'COVERAGE DES TESTS'
                echo '======================================'

                sh '''
                    set -e

                    rm -rf coverage

                    npm run test:coverage

                    echo ""
                    echo "Verification du rapport LCOV..."

                    if [ ! -f coverage/lcov.info ]; then
                        echo "ERREUR : coverage/lcov.info introuvable."
                        exit 1
                    fi

                    echo "Rapport LCOV OK :"
                    ls -lh coverage/lcov.info
                '''
            }

            post {
                always {
                    echo 'Archivage du rapport de couverture...'

                    archiveArtifacts(
                        artifacts: 'coverage/**',
                        allowEmptyArchive: true,
                        fingerprint: true
                    )
                }
            }
        }


        // ============================================================
        // 7. SONARQUBE
        // ============================================================

        stage('SonarQube') {

            options {
                timeout(time: 15, unit: 'MINUTES')
            }

            steps {

                echo '======================================'
                echo 'ANALYSE SONARQUBE'
                echo '======================================'

                script {

                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {

                        sh """
                            set -e

                            echo "======================================"
                            echo "ENVIRONNEMENT SONARQUBE"
                            echo "======================================"

                            echo "Node.js :"
                            node --version

                            echo "npm :"
                            npm --version

                            echo ""
                            echo "SonarScanner :"
                            ${scannerHome}/bin/sonar-scanner

                            echo ""
                            echo "Analyse SonarQube terminee."
                        """
                    }
                }
            }
        }


        // ============================================================
        // 8. QUALITY GATE
        // ============================================================

        stage('Quality Gate') {

            options {
                timeout(time: 10, unit: 'MINUTES')
            }

            steps {

                echo '======================================'
                echo 'QUALITY GATE SONARQUBE'
                echo '======================================'

                script {

                    /*
                     * waitForQualityGate attend la notification
                     * envoyee par le webhook SonarQube.
                     *
                     * Webhook a configurer dans SonarQube :
                     *
                     * http://jenkins:8080/sonarqube-webhook/
                     */

                    def qualityGate = waitForQualityGate()

                    echo ""
                    echo "======================================"
                    echo "RESULTAT QUALITY GATE"
                    echo "======================================"

                    echo "Status : ${qualityGate.status}"

                    if (qualityGate.status != 'OK') {

                        error(
                            "Quality Gate SonarQube non conforme : " +
                            qualityGate.status
                        )
                    }

                    echo ""
                    echo "Quality Gate SonarQube : OK"
                }
            }
        }
    }


    // ================================================================
    // POST BUILD
    // ================================================================

    post {

        success {

            echo '''
======================================
             BUILD SUCCESS
======================================

Projet : ShopNow Test Platform

Etapes validees :

[OK] Checkout GitLab
[OK] Verification environnement
[OK] Installation npm
[OK] Tests unitaires
[OK] Tests API
[OK] Coverage
[OK] Analyse SonarQube
[OK] Quality Gate

======================================
Pipeline CI termine avec succes.
======================================
'''
        }


        failure {

            echo '''
======================================
             BUILD FAILURE
======================================

Une ou plusieurs etapes du pipeline
ont echoue.

Consultez les logs Jenkins pour
identifier l etape en erreur.

======================================
'''
        }


        aborted {

            echo '''
======================================
             BUILD ABORTED
======================================

Le pipeline a ete interrompu,
generalement a cause d un timeout
ou d une interruption manuelle.

======================================
'''
        }


        unstable {

            echo '''
======================================
             BUILD UNSTABLE
======================================

Le pipeline est termine mais
certains resultats necessitent
une verification.

======================================
'''
        }


        always {

            echo '======================================'
            echo 'FIN DU PIPELINE'
            echo '======================================'

            sh '''
                echo "Build termine."
                echo "Date : $(date)"
                echo "Workspace : $(pwd)"
            '''
        }
    }
}
```
