# Jenkins

Jenkins is an open source automation server written in Java. Jenkins helps to automate the non-human part of the software development process, with continuous integration and facilitating technical aspects of continuous delivery.

Test framework is compatible with Jenkins

# Basic Usage

First you need to build Jenkins Docker images

### Build Jenkins Docker Images

```bash
cd ./jenkins // this is required step
./build.sh
```

This will build 2 images:

1. jenkins-server - jenkins installed in this image, uses ./jenkins/Dockerfile
2. jenkins-data - data volume for jenkins server, jekins will store everything in this image, uses ./jenkins/Dockerfile-data

### Runnning containers

```bash
cd ./jenkins // this is required step
./run.sh
```

### Admin password

After first run Jenkins will create random admin password. You can obtain this password, by running following command:

```bash
sudo docker exec jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword
```

### Access URL

Jenkins is accessible via 8080 port on localhost, open `http://localhost:8080` in your browser.
It will require password, paste password from above step to the password field

### Required plugins

After login jenkins will give 2 choices:

1. Install recommended plugins
2. Select plugins to install manually

You should choose first step, it will install: GitSCM, Pipeline, Pipeline API, etc...

### Setting up credentials

To successfully pull, fetch remote GIT repositories you will need to create git credential.
Go to this page:

```
http://localhost:8080/credentials/store/system/domain/_/newCredentials
```

And fill in fields like this:

```
1. Kind: Username with password
2. Scope: Global
3. Username: Your Git username
4. Password: Your Git password
5. ID: git_user
```

ID should be: git_user! We are referencing to this id in `Jenkinsfile`, if you want to use different ID, please change it in `Jenkinsfile` also

# Prerequisites

Since the project is configured to use Sonarqube, you may want to first start Sonarqube platform before creating and running any pipelines.

Sonarqube documentation is `./Sonarqube.md`

You will need to start nexus at `9000` port on the host machine, since the jenkins container is started with `network=host` configuration, this port will be accessible under CI docker container.

# Pipeline configuration

### Creating a Pipeline

You will need to create Pipeline item, go to this page:

```
http://localhost:8080/view/all/newJob
```

Name of the item can be: `test-pipeline`.

In the item types, please select: `Pipeline`.

Then click on `Create` button

### Configuring a Pipeline

After you created the pipeline, you will be redirected to the pipeline configuration page.
In this page go to `Pipeline`, and fill in fields in this section, please note that some fields will appear after Definition and SCM selection.

```
1. Definition: Pipeline script from SCM
2. SCM: Git
3. Repository Url: test framework git url (should be HTTPS)
4. Credentials: select your created git_user credentials
5. Branches to build: can be `*/master`, but you can specify your own, if you want
6. Script Path: Jenkinsfile
```

And then click `Save`

### Pipeline as code

Pipeline stages are described in `./Jenkinsfile`

### Run pipeline

Go to dashboard page:

```
http://localhost:8080/
```

You will see a table of pipelines, in this table click `Build now` buttons of your pipeline.

Build will queued and displayed in `Build queue` section in dashboard

### Filesystem SCM

In case you want to build from local git, you can run `./jenkins/run-local-scm.sh` script, the script will run jenkins server with volume container but it will also mount current project folder to `/app` in container file system.

You will need to install [File System SCM plugin](http://wiki.jenkins-ci.org/display/JENKINS/File+System+SCM) 2.

To build pipeline from local scm you need to create pipeline like it's described above for remote scm, except the last Pipeline fields group should be filled in like this:

```
Definition: Pipeline script from SCM
SCM: File System
Path: /app
Copy Hidden Files/Folder: checked
Script Path: Jenkinsfile
```

WARNING: `Copy Hidden Files/Folder` checkbox should be checked for filesystem scm!

Then try to start your pipeline.

PS: This is NOT recommended way of building and that's not how CI supposed to be, use filesystem scm only on critical cases, when you somehow don't have access to remote scm.
PS: Probably you are going to have permission or relative path issues

## Pipeline configuration for Implementation

The same as Base pipeline configuration.
Pipeline configuration:

```
1. Definition: Pipeline script from SCM
2. SCM: Git
3. Repository Url: Implementation git https url
4. Credentials: select your created git_user credentials
5. Branches to build: can be `*/master`, but you can specify your own, if you want
6. Script Path: Jenkinsfile
```

## Pipeline configuration for Implementation file system scm

The same as Base pipeline configuration.
Pipeline configuration:

```
1. Definition: Pipeline script from SCM
2. SCM: File System
3. Path: /app
4. Copy Hidden Files/Folder: checked
5. Script Path: implementation/Jenkinsfile-local
```
