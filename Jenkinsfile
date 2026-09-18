pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Tests unitaires') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('Tests API') {
            steps {
                sh 'npm run test:integration'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run test:coverage'
            }
        }

        stage('SonarQube') {
            steps {
                sh '''
                    if curl -fsS http://sonarqube:9000 >/dev/null 2>&1; then
                        if command -v sonar-scanner >/dev/null 2>&1; then
                            sonar-scanner \
                                -Dsonar.projectKey=shopnow \
                                -Dsonar.projectName="ShopNow Test Platform" \
                                -Dsonar.sources=app/src \
                                -Dsonar.tests=tests \
                                -Dsonar.test.inclusions="tests/**/*.test.js" \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.host.url=http://sonarqube:9000 \
                                -Dsonar.login=admin \
                                -Dsonar.password=admin
                        else
                            echo 'sonar-scanner non installé dans l’environnement Jenkins.'
                        fi
                    else
                        echo 'SonarQube non disponible, étape ignorée.'
                    fi
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline terminée avec succès'
        }
        failure {
            echo 'Pipeline en échec'
        }
    }
}