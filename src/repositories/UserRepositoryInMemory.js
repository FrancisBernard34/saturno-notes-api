class UserRepositoryInMemory {
  constructor() {
    this.users = [];
    this.id = 1;
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findById(id) {
    return this.users.find(user => user.id === id);
  }

  async create({ name, email, password }) {
    const user = {
      id: this.id++,
      name,
      email,
      password
    };

    this.users.push(user);
    return user;
  }

  async update(user) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    }
    return user;
  }
}

module.exports = UserRepositoryInMemory;