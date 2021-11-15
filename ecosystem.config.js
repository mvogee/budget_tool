module.exports = {
  apps: [{
    name: 'budgetTool',
    script: './src/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-53-239-48.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/btoolkey1.pem',
      ref: 'origin/main',
      repo: 'git@github.com:mvogee/budget_tool.git',
      path: '/home/ubuntu/server/budget_tool',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
