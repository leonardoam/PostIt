#!/bin/bash

#create users
curl -i -X POST -H "Content-Type: application/json" -d '{"firstname": "Emanuel", "user": "emanuelvalente", "password": "emapass", "birthday": "10", "birthmonth": "2", "birthyear": "1940", "description": "ema description", "email": "emanuelvalente@gmail.com", "gender": "m" }' http://localhost:1337/user/create_user
curl -i -X POST -H "Content-Type: application/json" -d '{"firstname": "Emanuel", "user": "emanuelvalente1", "password": "emapass", "birthday": "10", "birthmonth": "2", "birthyear": "1940", "description": "ema description", "email": "emanuelvalente@gmail.com", "gender": "m" }' http://localhost:1337/user/create_user



#create tweets
curl -i -X POST -H "Content-Type: application/json" -d '{"user_id": 1, "tweet": "isso é uma mensagem postada", "title": "mytitle"}' http://localhost:1337/tweet/create_tweet
curl -i -X POST -H "Content-Type: application/json" -d '{"user_id": 1, "tweet": "isso é uma mensagem postada1", "title": "mytitle"}' http://localhost:1337/tweet/create_tweet
curl -i -X POST -H "Content-Type: application/json" -d '{"user_id": 1, "tweet": "isso é uma mensagem postada2", "title": "mytitle"}' http://localhost:1337/tweet/create_tweet

