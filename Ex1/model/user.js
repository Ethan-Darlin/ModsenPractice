const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class User {
  async createUser(username, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        refreshToken: null, 
      },
    });
  
    const accessToken = jwt.sign({ id: newUser.id, role: newUser.role }, 'your_jwt_secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: newUser.id }, 'your_refresh_token_secret');
  
    await this.updateRefreshToken(newUser.id, refreshToken);
  
    return { ...newUser, accessToken, refreshToken };
  }
  async findByUsername(username) {
    return await prisma.user.findUnique({ where: { username } });
  }

  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async updateRefreshToken(userId, refreshToken) {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}

module.exports = new User();