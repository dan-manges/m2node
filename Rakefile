SPEC_DIR = File.dirname(__FILE__) + "/spec"

task :default => %w[compile test]

desc "compile coffee to js"
task :compile do
  sh "coffee -c examples lib"
end

desc "run the tests"
task :test do
  sh "vows spec/m2node_spec.js"
end

namespace :test do
  namespace :app do
    task :start => :compile do
      sh "coffee spec/app.coffee"
    end
  end

  namespace :m2 do
    task :load do
      Dir.chdir(SPEC_DIR) do
        sh "m2sh load --config mongrel2.conf --db config.sqlite"
      end
    end

    task :start => :load do
      Dir.chdir(SPEC_DIR) do
        sh "m2sh start -name m2node_tests --db config.sqlite"
      end
    end
  end
end
