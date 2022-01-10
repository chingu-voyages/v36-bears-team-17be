import express from 'express';

const app = express();

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.listen(5000, () => console.log('Server running'));
