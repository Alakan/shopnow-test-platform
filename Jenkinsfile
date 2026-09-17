pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()

        // Filet de sécurité uniquement : avec Node 18 pour l'analyseur
        // SonarQube, le pipeline complet tourne en ~3 minutes.
        //
        // Historique : un build a été ABORTED car Jenkins a redémarré
        // pendant l'analyse ("Resuming build ... after Jenkins restart").
        // Pendant l'arrêt, le compteur du timeout continuait de tourner :
        // au redémarrage, "Timeout expired 4 min 9 sec ago" => annulation.
        // On garde donc une marge large.
        timeout(time: 25, unit: 'MINUTES')
    }

    environment {
        // Runtime Node utilisé par l'analyseur JavaScript de SonarQube.
        // SonarQube 9.9 recommande Node 18 ; avec Node 22 l'analyse passe
        // de quelques secondes à ~7 minutes (voir jenkins/Dockerfile).
        SONAR_NODEJS = '/opt/node18/bin/node'
    }

    stages {

        stage('Environment') {
            steps {
                echo '======================================'
                echo 'Vérification de l’environnement Jenkins'
                echo '======================================'

                sh """
                    echo "Node.js (tests):"
                    node --version

                    echo "npm:"
                    npm --version

                    echo "Node.js (analyseur SonarQube):"
                    if [ -x "${SONAR_NODEJS}" ]; then
                        "${SONAR_NODEJS}" --version
                    else
                        echo "ABSENT -> ${SONAR_NODEJS} (rebuild jenkins/Dockerfile)"
                    fi

                    echo "Git:"
                    git --version

                    echo "Chromium:"
                    chromium --version
                """
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
                // L'analyse dure ~30 s avec Node 18 (contre ~7 min avec Node 22).
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
                            # Échoue vite et clairement si le Node 18 dédié manque
                            # (sinon le scanner retombe sur Node 22 et devient très lent).
                            test -x "${SONAR_NODEJS}" || {
                                echo "ERREUR : ${SONAR_NODEJS} introuvable."
                                echo "Reconstruire l'image Jenkins : docker compose build jenkins"
                                exit 1
                            }

                            "${scannerHome}/bin/sonar-scanner" -Dsonar.nodejs.executable="${SONAR_NODEJS}"
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

        aborted {
            echo '======================================'
            echo 'Pipeline interrompu (timeout ou arrêt de Jenkins).'
            echo 'Vérifier que Jenkins n’a pas redémarré pendant le build.'
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
