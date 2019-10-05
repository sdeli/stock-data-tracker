FROM node:10.0.0
COPY . /stock-data-tracker
WORKDIR /stock-data-tracker
RUN ["ls", "-la"]
RUN ["ls", "-la", "./app/assets"]
RUN ["ls", "-la", "./app"]
RUN ["npm", "i", "-g", "recursive-install"]
RUN ["npm", "install", "-g", "pm2"]
RUN npm install && npm-recursive-install --rootDir=./app/libs
RUN ["cp", "./app/assets/authenticate.js", "./node_modules/passport/lib/middleware/authenticate.js"]
RUN ["cp", "./app/assets/strategy.js", "./node_modules/passport-local/lib/strategy.js"]
WORKDIR /stock-data-tracker/app
#CMD ["/root/.nvm/versions/node/v10.0.0/bin/pm2", "start", "app.js", "--node-args=\"--inspect-brk\"", "--watch"]
# sudo docker build --tag=test.austriaiallas.com ./austria-recruitment

# /root/.nvm/versions/node/v10.0.0/bin/pm2 start app.js --node-args="--inspect-brk"--watch