#!/bin/bash

docker build . -t registry.gimaym.com/frontend:develop
docker push registry.gimaym.com/frontend:develop