process.env.NODE_ENV = 'test';

// Import supertest to simulate HTTP requests
const request = require('supertest');
const app = require('./app');
const db = require('./db');

// Clear the books table before each test to ensure isolation
beforeEach(async () => {
  await db.query('DELETE FROM books');
});

describe('GET /books', () => {
  test('should respond with a list of books', async () => {
    const response = await request(app).get('/books'); // send a GET request to /books endpoint
    // Check that the status code is 200
    expect(response.statusCode).toBe(200);
    // Check that the response has a books property and that its an array
    expect(response.body).toHaveProperty('books');
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});

describe('POST /books', () => {
  test('should create a new book with valid data', async () => {
    // Define a new book with all required fields
    const newBook = {
      isbn: '1234567890',
      amazon_url: 'http://a.co/newbook',
      author: 'Jimmys Johns',
      language: 'english',
      pages: 150,
      publisher: 'Example Publisher',
      title: 'New Book Title',
      year: 2021,
    };

    // Send a POST request to create a new book
    const response = await request(app)
      .post('/books')
      .set('Content-Type', 'application/json')
      .send(newBook);

    // Expect a 201 response
    expect(response.statusCode).toBe(201);
    // Expect a response body to have a book property
    expect(response.body).toHaveProperty('book');
  });

  test('should return a 400 error when provided invalid data', async () => {
    // Create an invalid book object
    const invalidBook = {
      isbn: '1234567891',
      amazon_url: 'http://a.co/newbook',
      author: 'Jimmys Johns',
      // language: 'english',
      pages: 150,
      publisher: 'Example Publisher',
      title: 'New Book Title',
      year: 2021,
    };

    // Send a POST request with the invalid book
    const response = await request(app).post('/books').send(invalidBook);

    // Expect a 400 response
    expect(response.statusCode).toBe(400);
  });
});

// Close the database connection after all tests run
afterAll(async () => {
  await db.end();
});
