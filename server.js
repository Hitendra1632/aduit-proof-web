const express = require('express');
const app = express();

app.use(express.static('./dist/dd-identity-app'));

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/dd-identity-app'}
);
});

app.listen(process.env.PORT || 8080);
