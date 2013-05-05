require 'capistrano/node-deploy'

set :application, "scriptkiddies"
set :repository,  "git@github.com/AdamFerguson/scriptkiddies.git"
set :scm, :git
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

# role :web, "your web-server here"                          # Your HTTP server, Apache/etc
role :app, "adam-ferguson.com"                          # This may be the same as your `Web` server
# role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
# role :db,  "your slave db-server here"

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
