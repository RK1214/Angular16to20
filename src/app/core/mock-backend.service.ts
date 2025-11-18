import { InMemoryDbService } from 'angular-in-memory-web-api';

export class MockBackendService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 1, name: 'Alice Anderson', email: 'alice@example.com', role: 'Admin' },
      { id: 2, name: 'Bob Brown', email: 'bob@example.com', role: 'User' },
      { id: 3, name: 'Carlos Cruz', email: 'carlos@example.com', role: 'User' }
    ];
    return { users };
  }
}
