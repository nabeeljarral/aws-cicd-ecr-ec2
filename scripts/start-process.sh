#!/bin/bash
sudo -u root aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 376129854991.dkr.ecr.ap-south-1.amazonaws.com
sudo -u root docker rm -f `docker ps -q -a`
sudo -u root docker rmi -f `docker images -q`
sleep 3
sudo -u root docker pull 376129854991.dkr.ecr.ap-southeast-1.amazonaws.com/aws-codepipeline-project:latest
if [[ $? != 0 ]]
then
    sudo -u root aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 376129854991.dkr.ecr.ap-south-1.amazonaws.com
    sudo -u root docker pull 376129854991.dkr.ecr.ap-south-1.amazonaws.com/my-app:latest
fi
sudo -u root docker run -d -p 80:3000 --name aws-codepipeline-project 376129854991.dkr.ecr.ap-south-1.amazonaws.com/my-app:latest
