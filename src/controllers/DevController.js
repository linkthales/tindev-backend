const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    try {
      const loggedDev = await Dev.findById(user);

      const users = await Dev.find({
        $and: [
          { _id: { $ne: loggedDev._id } },
          { _id: { $nin: loggedDev.likes } },
          { _id: { $nin: loggedDev.dislikes } },
        ],
      });

      return res.json(users);
    } catch (error) {
      console.error(error);

      return res.status(404).send('Usuário não encontrado');
    }
  },

  async store(req, res) {
    const { username } = req.body;

    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);

      const userExists = await Dev.findOne({ user: username });

      if (userExists) {
        return res.json(userExists);
      }

      const { name, bio, avatar_url: avatar, } = response.data;

      const dev = await Dev.create({
        name,
        user: username,
        bio,
        avatar,
      })

      return res.json(dev);
    } catch (error) {
      console.error(error);

      return res.status(404).send('Usuário não encontrado');
    }
  },
};