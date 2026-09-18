pipeline {

```
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
            echo '===== CHECKOUT ====='
            checkout scm
        }
    }

    stage('Environment') {
        steps {
            echo '===== ENVIRONMENT ====='

            sh '''
                set -e

                echo "Node.js:"
                node --version

                echo "npm:"
                npm --version

                echo "Git:"
                git --version

                echo "Java:"
                java -version || true

                echo "Chromium:"
                chromium --version || true
            '''
        }
    }

    stage('Installation') {
        steps {
            echo '===== INSTALLATION ====='

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
            echo '===== TESTS API ====='

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

                test -f coverage/lcov.info

                echo "LCOV OK"
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
            echo '===== SONARQUBE ====='

            script {
                def scannerHome = tool 'SonarScanner'

                withSonarQubeEnv('SonarQube') {
                    sh """
                        set -e

                        echo "Node.js:"
                        node --version

                        echo "SonarScanner:"
                        ${scannerHome}/bin/sonar-scanner
                    """
                }
            }
        }
    }

    stage('Quality Gate') {
        steps {
            echo '===== QUALITY GATE ====='

            script {

                timeout(time: 10, unit: 'MINUTES') {

                    def qualityGate = waitForQualityGate()

                    echo "Quality Gate : ${qualityGate.status}"

                    if (qualityGate.status != 'OK') {
                        error(
                            "Quality Gate SonarQube non conforme : " +
                            qualityGate.status
                        )
                    }
                }
            }
        }
    }
}

post {

    success {
        echo '''
```

========================================
SHOPNOW CI SUCCESS
==================

Checkout              : OK
Installation          : OK
Tests unitaires       : OK
Tests API             : OK
Coverage              : OK
SonarQube             : OK
Quality Gate          : OK

========================================
'''
}

```
    failure {
        echo '''
```

========================================
SHOPNOW CI FAILURE
==================

Consulter les logs Jenkins pour
identifier l'étape en erreur.

========================================
'''
}

```
    aborted {
        echo '''
```

========================================
SHOPNOW CI ABORTED
==================

'''
}

```
    always {
        echo '===== FIN DU PIPELINE ====='
    }
}
```

}
