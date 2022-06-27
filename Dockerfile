FROM node:16

ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo
WORKDIR /app

CMD bash -c "yarn install && yarn dev"