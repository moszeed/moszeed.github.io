# base image
FROM mhart/alpine-node:latest

# set console runtime
ENV TERM xterm

# exclude npm cache from the image
VOLUME /root/.npm

# add files ad set workdir
COPY . /moszeed-page
WORKDIR /moszeed-page

# add runtime for native compiling
RUN apk update && \
    apk add nano git python make g++ gcc krb5-dev

# install dependecys, but first set oberon as registry archive
RUN npm install

# remove runtime and cache
RUN apk del git python make g++ gcc krb5-dev && \
    rm -rf /tmp/* /var/cache/apk/* /root/.node-gyp

# set app port
EXPOSE 8686

#launch dev environment
CMD npm run serve
