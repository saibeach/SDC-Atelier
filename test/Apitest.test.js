const request = require('supertest');
const app = require('../src/app.jsx');

describe('GET /api/questions', () => {
  it('responds with JSON data', async () => {
    const response = await request(app)
      .get('/api/questions')
      .query({ product_id: 1, count: 10 });
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveLength(10); // assuming you have 10 rows in your test database for product_id 1
  });

  it('handles errors gracefully', async () => {
    // mock the database query to return an error
    const originalQuery = pool.query;
    pool.query = jest.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/api/questions').query({ product_id: 1, count: 10 });
    expect(response.status).toBe(500);

    // restore the original query function
    pool.query = originalQuery;
  });
});