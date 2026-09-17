pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {

        stage('Environment') {
            steps {
                echo '======================================'
                echo 'Vérification de l’environnement Jenkins'
                echo '======================================'

                sh '''
                    echo "Node.js:"
                    node --version

                    echo "npm:"
                    npm --version

                    echo "Git:"
                    git --version

                    echo "Chromium:"
                    chromium --version
                '''
            }
        }

        stage('Installation') {
            steps {
                echo '======================================'
                echo 'Installation des dépendances'
                echo '======================================'

                sh '''
                    npm ci \
                      --cache "$JENKINS_HOME/.npm-cache" \
                      --prefer-offline \
                      --no-audit \
                      --no-fund
                '''
            }
        }

        stage('Tests unitaires') {
            steps {
                echo '======================================'
                echo 'Tests unitaires'
                echo '======================================'

                sh 'npm run test:unit'
            }
        }

        stage('Tests API') {
            steps {
                echo '======================================'
                echo 'Tests API / intégration'
                echo '======================================'

                sh 'npm run test:integration'
            }
        }

        stage('Coverage') {
            steps {
                echo '======================================'
                echo 'Génération de la couverture'
                echo '======================================'

                sh 'npm run test:coverage'

                sh '''
                    echo "Rapport de couverture :"
                    ls -lh coverage/ || true

                    echo ""
                    echo "Fichier LCOV :"
                    ls -lh coverage/lcov.info || true
                '''
            }
        }

        stage('SonarQube') {
            options {
                timeout(time: 5, unit: 'MINUTES')
            }

            steps {
                echo '======================================'
                echo 'Analyse SonarQube'
                echo '======================================'

                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }
    }

    post {

        always {
            echo '======================================'
            echo 'Fin du pipeline ShopNow'
            echo '======================================'
        }

        success {
            echo '======================================'
            echo 'Pipeline terminé avec succès.'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'Pipeline en échec.'
            echo 'Consultez les logs Jenkins pour identifier le problème.'
            echo '======================================'
        }
    }
}