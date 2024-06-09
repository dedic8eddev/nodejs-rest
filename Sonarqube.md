# Sonarqube

SonarQube is an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages

## Configure server

1. Run sonarqube server: `./sonarqube/run.sh`
2. Go to `localhost:9000` and login as `admin`, password: `admin`
3. Go to this [page](http://localhost:9000/projects/create) and create project with the following properties:
   Project Key: `rest`
   Project Name: `REST`

## Usage Guide

We have 2 ways of using Sonarqube:

1. Local
2. Jenkins Pipeline

### Local Usage

In this option, you will manually run sonar from console/terminal.
You will need to:

1. Install sonar-scanner: [Installation Guide](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner#AnalyzingwithSonarQubeScanner-Installation)
2. Run `npm run sonar-scanner` from the project root directory
3. Go to sonarqube dashboard and refresh the page, you will see that rest project has some metrics like: code smells, coverage, unit tests, etc...

Sonar scanner uses Dependency-Check and code coverage reports you will need to run commands in the correct order:

1. `npm test` -> Will create `./coverage/`
2. `npm run check-deps` -> Will create `./dependency-check-report.xml`
3. `npm run sonar-scanner` -> Will use coverage and deps check report

#### Using Dependency-Check

Dependency-Check will analyze all dependencies for vulnerabilities.
To use Dependency-Check you need:

1. Install Dependency-Check: [Installation Guide](https://jeremylong.github.io/DependencyCheck/)
2. Run `npm run check-deps`

Dependency-Check should create a report `./dependency-check-report.xml`, this report will be used by sonar-scanner later.

### Usage under CI

The project has `./Jenkinsfile` which uses Sonar scanner and dependency check. You will need to install required plugins and configure them correctly.

#### Step 1: SonarQube configuration

First let's create auth token which will be used by Jenkins:

1. Go to SonarQube [security page](http://localhost:9000/account/security/)
2. Create token "jenkins", save it's value, we will use it later

Then we will need to create a webhook to Jenkins:

1. Go to the [rest project webhooks](http://localhost:9000/project/webhooks?id=rest)
2. Create new webhook:
   Name=Jenkins
   Url=http://localhost:8080/sonarqube-webhook/

#### Step 2: Jenkins Configuration

Go to `Jenkins` plugins dashboard and install two plugins:

1. [`SonarQube Scanner for Jenkins`](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner+for+Jenkins):
2. [OWASP Dependency-Check](https://plugins.jenkins.io/dependency-check-jenkins-plugin)
3. Go to [tools configuration page](http://localhost:8080/configureTools/)
4. Add new SonarScanner installation, with the following properties:
   Name=sonar-scanner
   Installed automatically=checked
   Version: SonarQube Latest, >3V
5. Go to [configuration page](http://localhost:8080/configure)
6. Add new Sonar server:
   Enable injection...=yes
   Name=Sonar Server
   Server URL=http://localhost:9000
   Add new credential: Kind=Secret text, ID=jenkins, Secret=SonarQube Token Value

#### Step 3: Pipeline Configuration

1. Create multibranch pipeline
2. Add Branch Source: fill in correct git repository url and git credentials
3. Run pipeline

## Troubleshooting

### Terminal can't find sonar-scanner or dependency-check

In Local Usage you may need to add `sonar-scanner` to the global PATH variable:

```sh
export PATH="$PATH:/path/to/sonar-scanner/bin/
```

The same for `dependency-check`

### Trouble with incorrect/unset JAVA_HOME under CI/Jenkins

1. Go to Jenkins [configuration page](http://localhost:8080/configure)
2. Add new ENV variable: NAME=JAVA_HOME, VALUE=/usr/lib/jvm/java-8-openjdk-amd64/jre/
3. Save and rerun pipeline
