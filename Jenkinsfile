```groovy
pipeline {

    agent any

    options {
        // Évite qu'une analyse SonarQube longue bloque indéfiniment le pipeline
        timeout(time: 20, unit: 'MINUTES')

        // Conserve les logs utiles
        timestamps()

        // Évite plusieurs builds simultanés du même job
        disableConcurrentBuilds()

        // Nettoyage automatique de l'ancien workspace avant le build
        skipDefaultCheckout(true)
    }

    environment {
        CI = 'true'

        // Projet SonarQube
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
                echo 'Checkout du projet'
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
                    echo "Chrome / Chromium :"
                    chromium --version || google-chrome --version || true

                    echo ""
                    echo "Architecture :"
                    uname -a

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
                echo 'Installation des dépendances'
                echo '======================================'

                sh '''
                    set -e

                    if [ -f package-lock.json ]; then
                        echo "package-lock.json trouvé."
                        echo "Installation avec npm ci..."

                        npm ci \
                            --cache /var/jenkins_home/.npm-cache \
                            --prefer-offline \
                            --no-audit \
                            --no-fund
                    else
                        echo "ATTENTION : package-lock.json absent."
                        echo "Installation avec npm install..."

                        npm install \
                            --no-audit \
                            --no-fund
                    fi

                    echo ""
                    echo "Dépendances installées."
                '''
            }
        }


        // ============================================================
        // 4. TESTS UNITAIRES
        // ============================================================

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


        // ============================================================
        // 5. TESTS API / INTEGRATION
        // ============================================================

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


        // ============================================================
        // 6. COVERAGE
        // ============================================================

        stage('Coverage') {
            steps {
                echo '======================================'
                echo 'Calcul de la couverture de code'
                echo '======================================'

                sh '''
                    set -e

                    rm -rf coverage

                    npm run test:coverage

                    echo ""
                    echo "======================================"
                    echo "Vérification du rapport LCOV"
                    echo "======================================"

                    if [ -f coverage/lcov.info ]; then
                        echo "Rapport LCOV généré :"
                        ls -lh coverage/lcov.info
                    else
                        echo "ERREUR : coverage/lcov.info introuvable."
                        exit 1
                    fi
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
                // Sonar peut prendre plusieurs minutes sur ce projet
                timeout(time: 15, unit: 'MINUTES')
            }

            steps {
                echo '======================================'
                echo 'Analyse SonarQube'
                echo '======================================'

                script {

                    // Récupération de SonarScanner configuré dans Jenkins
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {

                        sh """
                            set -e

                            echo "======================================"
                            echo "Node.js utilisé par SonarScanner"
                            echo "======================================"

                            node --version
                            npm --version

                            echo ""
                            echo "======================================"
                            echo "SonarScanner"
                            echo "======================================"

                            ${scannerHome}/bin/sonar-scanner
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
                timeout(time: 5, unit: 'MINUTES')
            }

            steps {
                echo '======================================'
                echo 'Vérification du Quality Gate'
                echo '======================================'

                script {

                    // Attend le résultat du Quality Gate SonarQube
                    // Le nom "SonarQube" doit correspondre au serveur
                    // configuré dans Jenkins.
                    timeout(time: 5, unit: 'MINUTES') {

                        def qualityGate = waitForQualityGate()

                        echo "Quality Gate : ${qualityGate.status}"

                        if (qualityGate.status != 'OK') {
                            error "Quality Gate SonarQube non conforme : ${qualityGate.status}"
                        }
                    }
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
            Consulter les logs Jenkins pour identifier l'étape concernée.
            ======================================
            '''
        }

        unstable {
            echo '''
            ======================================
            BUILD UNSTABLE
            ======================================
            Le pipeline est terminé mais certains
            résultats nécessitent une vérification.
            ======================================
            '''
        }

        always {
            echo 'Nettoyage des fichiers temporaires...'

            // Ne pas supprimer les fichiers utiles avant
            // l'archivage des artifacts.
            sh '''
                echo "Build terminé."
                echo "Workspace : $(pwd)"
            '''
        }
    }
}
```
