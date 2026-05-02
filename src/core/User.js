class User {
  constructor({ id, nickname, avatarUrl, email, farmName, tankCount, tanks = [] }) {
    this.id = id;
    this.nickname = nickname;
    this.avatarUrl = avatarUrl;
    this.email = email;
    this.farmName = farmName || '';
    this.tankCount = tankCount || 0;
    this.tanks = tanks;
  }
}

export default User;
