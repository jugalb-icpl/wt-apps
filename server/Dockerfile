FROM ubuntu:22.04

RUN apt-get update -y  --fix-missing
RUN apt-get upgrade -y  --fix-missing

#install packages on which wappalyzer is dependent
RUN apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# Set environment variables
ENV NODE_ENV production

# Set the working directory
WORKDIR /usr/app

# Install Python and build dependencies required for native modules
RUN apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    pkg-config \
    libpixman-1-dev \
    libjpeg-dev \
    libcairo2-dev \
    libgif-dev \
    libpango1.0-dev \
    libtool \
    autoconf \
    automake \
    bsdmainutils \
    uuid-runtime \
    snapd \
    # masscan \
    && ln -sf python3 /usr/bin/python


RUN apt-get install -y wget
RUN apt-get install -y alien
RUN wget -O /tmp/nmap-7.95-2.x86_64.rpm https://nmap.org/dist/nmap-7.95-2.x86_64.rpm
RUN alien -i /tmp/nmap-7.95-2.x86_64.rpm
RUN nmap --version

RUN wget -O /usr/bin/yq https://github.com/mikefarah/yq/releases/download/v4.9.8/yq_linux_amd64 && \
    chmod +x /usr/bin/yq

RUN yq


#installing nvm
RUN apt-get install -y wget
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

# set NVM environment variables
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION v16.19.1


# install Node.js using NVM
RUN . "$NVM_DIR/nvm.sh" \
    && nvm install v20.10.0 \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# set node and npm paths globally
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH


# Install Python packages from requirements.txt
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt


COPY microservice/ai-summarizers/pil-summarizer/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

#installing golang
RUN wget https://dl.google.com/go/go1.21.3.linux-amd64.tar.gz
RUN tar -xvf go1.21.3.linux-amd64.tar.gz -C /usr/local
RUN export GOROOT=/usr/local/go
RUN export GOPATH=$HOME/go
RUN export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
RUN . ~/.profile
RUN chmod +x /usr/local/go/bin/go
RUN /usr/local/go/bin/go install github.com/projectdiscovery/tlsx/cmd/tlsx@latest

# Copy your application's source code into the Docker image
COPY . .

#copying go executables in libs
RUN cp ~/go/bin/tlsx /usr/app/queuesV2/Libs/Tlsx

RUN [ -d node_modules ] && rm -r node_modules || true
RUN npm install

# Expose the port the app runs on
EXPOSE 8090


RUN npm install -g yarn

# installing and linking packages for wappalyzer
RUN cd queuesV2/Libs/wappalyzer && \
    yarn install && \
    yarn run link && \
    cd ../../../


#installing pm2 globally
RUN npm install -g pm2

# Copy PM2 ecosystem file
COPY ecosystem.config.js ./

# command to start all the services in pm2 ecosystem
CMD [ "pm2", "start", "services_ecosystem.config.js", "--no-daemon" ]