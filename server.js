const express = require('express');
const app = express();

app.use(express.static('./dist/tailwind-app'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/tailwind-app'}
);
});

app.listen(process.env.PORT || 8080);
