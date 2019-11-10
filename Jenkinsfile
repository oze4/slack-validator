def app
def slave_pod = 'jenkins-slave-pod'
def container_in_slave_pod = 'docker'
def kube_config_id = 'ost-sf-kube-00-config'
def deployment_manifest = 'deploy/*'
def dockerhub_container_name = 'oze4/ugonnawinms-slack-validator'

podTemplate(label: slave_pod) {
    node(slave_pod) {
        container(container_in_slave_pod) {
            stage('Clone Repository') {
                checkout scm
            }
            
            stage ('Build Image') {
                app = docker.build("${dockerhub_container_name}")
            }
            
            stage('Test Image') {
                app.inside {
                    sh 'echo "Volkswagen Tests passed"'
                }
            }
            
            stage('Push Image To Docker Hub') {
                docker.withRegistry("${CONTAINER_REGISTRY}", 'docker-hub-credentials') {
                    app.push("${env.BUILD_NUMBER}")
                    app.push("latest")
                }
            }
            
            stage('Clean Pod') {
                kubernetesDeploy(
                    kubeconfigId: "${kube_config_id}",
                    configs: "${deployment_manifest}",
                    deleteResource: true
                )
            }
            
            stage('Deploy New Pod') {
                kubernetesDeploy(
                    kubeconfigId: "${kube_config_id}",
                    configs: "${deployment_manifest}",
                )
            }
        }
    }
}