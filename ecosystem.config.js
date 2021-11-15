module.exports = {
  apps: [{
    name: 'budgetTool',
    script: './src/index.js',
    node_args : '-r dotenv/config'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-53-239-48.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/btoolkey1.pem',
      ref: 'origin/main',
      repo: 'git@github.com:mvogee/budget_tool.git',
      path: '/home/ubuntu/server/budgetTool',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
