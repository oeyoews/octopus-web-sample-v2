#!/bin/bash

echo "Deploying to http://192.168.1.120:9099"

python3 -m http.server 9099 --directory dist