# see: http://blog.evantahler.com/blog/deploying-node-js-applications-with-capistrano.html

set :application, "scriptkiddies"
set :repository,  "git@github.com:AdamFerguson/scriptkiddies.git"
set :scm, :git
set :use_sudo, false
set :user, :deploy
set :ssh_options, {:forward_agent => true}
set :branch, :master
set :deploy_via, :remote_cache
set :port, 2222
set :keep_releases, 5
set :deploy_to, "/var/apps/node/#{application}"
default_run_options[:pty] = true

# node-deploy options
set :app_command, "app.js"
set :app_environment, "PORT=4343"

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :app, "adam-ferguson.com"                          # This may be the same as your `Web` server

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

namespace :deploy do

  before 'deploy:start', 'deploy:npm_install'
  before 'deploy:restart', 'deploy:npm_install'
  before 'deploy:default', 'deploy:setup'

  after 'deploy:create_symlink', 'deploy:symlink_node_folders'
  after 'deploy:setup', 'deploy:node_additional_setup'

  desc "START the servers"
  task :start, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && node_modules/.bin/forever start #{app_command}"
  end

  desc "STOP the servers"
  task :stop, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && node_modules/.bin/forever stop #{app_command}"
  end

  desc "RESTART the servers"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && node_modules/.bin/forever restart #{app_command}"
  end

  task :symlink_node_folders, :roles => :app, :except => { :no_release => true } do
    run "ln -s #{shared_path}/node_modules #{current_path}/node_modules"
  end

  task :node_additional_setup, :roles => :app, :except => { :no_release => true } do
    run "mkdir -p #{shared_path}/node_modules"
  end

  task :npm_install, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && npm install"
  end

  task :npm_update, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && npm update"
  end

end
