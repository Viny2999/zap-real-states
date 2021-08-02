import request from 'supertest';
import { App } from '../../app';

describe('Real State Controller Test', () => {
  it('Response 422 if Limit Parameters is incorrect', done => {
    request(App)
      .get('/realState/zap?limit=a')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('Response 422 if Page Parameters is incorrect', done => {
    request(App)
      .get('/realState/zap?page=a')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
});
