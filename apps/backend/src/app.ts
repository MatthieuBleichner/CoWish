import express from 'express';

export const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    void next;
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
);
