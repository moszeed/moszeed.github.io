# -*- mode: ruby -*-
# vi: set ft=ruby :

#original: https://gist.github.com/lmakarov/54302df8ecfc87b36320
$install_docker_compose = <<EOF

    DOCKER_COMPOSE_VERSION=1.18.0

    # Download docker-compose to the permanent storage
    echo 'Downloading docker-compose to the permanent VM storage...'
    sudo mkdir -p /var/lib/boot2docker/bin
    sudo curl -sL https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /var/lib/boot2docker/bin/docker-compose
    sudo chmod +x /var/lib/boot2docker/bin/docker-compose
    sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose

    # Making the symlink persistent via bootlocal.sh
    echo 'Writing to bootlocal.sh to make docker-compose available on every boot...'
    cat <<SCRIPT | sudo tee -a /var/lib/boot2docker/bootlocal.sh > /dev/null
        # docker-compose
        sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose
    SCRIPT

    sudo chmod +x /var/lib/boot2docker/bootlocal.sh
EOF


$build_project = <<EOF

    echo "Build Project";

    cd /moszeed-page
    docker-compose build --no-cache
EOF


$run_docker_compose = <<EOF

    #set hostname, same as host os
    sudo sethostname #{`hostname`[0..-2]}

    echo "wait 10 seconds"
    sleep 10

    # remove all untagged/dangling/none images
    DOCKER_DANGLING_IMAGES=$(docker images -q -f dangling=true)
    if [ -n "$DOCKER_DANGLING_IMAGES" ]; then
        docker rmi -f $DOCKER_DANGLING_IMAGES
    fi

    cd /moszeed-page
    docker-compose up -d
EOF

#
# vagrant configuration
#
Vagrant.configure(2) do |config|

    config.vm.box = "moszeed/boot2docker"

    #config for app
    config.vm.define :moszeed do |moszeed|

        #network
        moszeed.vm.network "forwarded_port", guest: 9090, host: 9090
        moszeed.vm.network "public_network"

        #shared folders
        moszeed.vm.synced_folder ".", "/moszeed-page"
        moszeed.vm.synced_folder ".", "/vagrant", disabled: true

        #scripts
        moszeed.vm.provision :shell, :inline => $install_docker_compose, :privileged => false
        moszeed.vm.provision :shell, :inline => $build_project, :privileged => false
        moszeed.vm.provision :shell, :inline => $run_docker_compose, :privileged => false, run: "always"

    end

    #set name for vm
    config.vm.provider "virtualbox" do |v|
        v.name = "moszeed-page"
        v.customize ["modifyvm", :id, "--memory", "1024"]
        v.customize ["sharedfolder", "add", :id, "--name", "www", "--hostpath", (("//?/" + File.dirname(__FILE__) + "/www").gsub("/","\\"))]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    end

end
