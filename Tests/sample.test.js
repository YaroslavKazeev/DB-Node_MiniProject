import request from 'supertest';
import app from '../app';

describe('POST /user/login', function() {
  it('responds with error', function(done) {
    request(app)
      .post('/users/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500, done)
      .expect({ error: 'Not implemented' });
  });
});
