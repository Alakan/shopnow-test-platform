pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo '======================================'
                echo 'Récupération du projet ShopNow'
                echo '======================================'

                checkout scm
            }
        }

        stage('Environment') {
            steps {
                echo 'Vérification de l’environnement Jenkins'

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
                echo 'Installation des dépendances'

                sh 'npm ci'
            }
        }

        stage('Tests unitaires') {
            steps {
                echo 'Exécution des tests unitaires'

                sh 'npm run test:unit'
            }
        }

        stage('Tests API') {
            steps {
                echo 'Exécution des tests API'

                sh 'npm run test:integration'
            }
        }

        stage('Coverage') {
            steps {
                echo 'Génération du rapport de couverture'

                sh 'npm run test:coverage'
            }
        }

        stage('Analyse SonarQube') {
            steps {

                echo 'Analyse du projet avec SonarQube'

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
            echo 'Pipeline terminé avec succès.'
        }

        failure {
            echo 'Le pipeline a échoué.'
        }
    }
}