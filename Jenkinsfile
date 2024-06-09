pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'npm ci'
      }
    }
    stage('dependencies audit') {
      steps {
        dependencyCheckAnalyzer datadir: '', hintsFile: '', includeCsvReports: false, includeHtmlReports: false, includeJsonReports: false, includeVulnReports: false, isAutoupdateDisabled: false, outdir: '', scanpath: './package.json, ./package-lock.json', skipOnScmChange: false, skipOnUpstreamChange: false, suppressionFile: '', zipExtensions: ''
      }
    }
    stage('test build') {
      steps {
        sh 'npm test'
      }
    }
    stage('SonarQube analysis') {
      environment {
        scannerHome = tool 'sonar-scanner'
      }
      steps {
        withSonarQubeEnv('Sonar Server') {
          sh "${scannerHome}/bin/sonar-scanner"
        }
        timeout(time: 10, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}

