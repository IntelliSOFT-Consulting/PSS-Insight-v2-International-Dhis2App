const config = {
  type: 'app',
  name: 'PSS Insight v2 Configuration',
  title: 'PSS Insight v2 Configuration',

  launch_path: '/index.html',
  activities: [
    {
      name: 'PSS V2',
      href: '/index.html',
    },
    {
      name: 'Create Template',
      href: '/create.html',
    },
  ],

  

  entryPoints: {
    app: './src/App.js',
  },
};

module.exports = config;
