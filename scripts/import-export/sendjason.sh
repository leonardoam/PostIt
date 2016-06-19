#!/bin/bash
curl -vX POST http://localhost:1337/maintenance/import_data -d @data2.json \
--header "Content-Type: application/json"
