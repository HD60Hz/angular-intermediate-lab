import { InMemoryDbService } from "angular-in-memory-web-api";

export class FakeBackendService implements InMemoryDbService {
  createDb() {
    let tasks = [
      {
        id: 1,
        description: "Faire les courses"
      },
      {
        id: 2,
        description: "Réparer la voiture"
      }
    ];

    return {
      tasks: tasks
    };
  }
}
