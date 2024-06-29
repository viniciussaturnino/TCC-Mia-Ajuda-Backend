const UserService = require("../../app/UserService");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res, next) {
    const data = req.body;

    
    try {
      const result = await this.userService.createUser(data);
      res.status(201).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUsers(_req, res, next) {
    try {
      const result = await this.userService.getUsers();
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUserByEmail(req, res, next) {
    try {
      const email = req.query.email;
      const result = await this.userService.getUserByEmail(email);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getUserById(req, res, next) {
    try {
      const id = req.params.id;
      const result = await this.userService.getUserById(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async updateUserById(req, res, next) {
    const id = req.params.id;
    const data = {
      email: req.body.email,
      photo: req.body.photo,
      name: req.body.name,
      phone: req.body.phone,
      notificationToken: req.body.notificationToken,
      deviceId: req.body.deviceId,
      address: req.body.address,
      biography: req.body.biography,
      location: req.body.location,
    };
    try {
      const result = await this.userService.updateUserById(id, data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async updateUserAddressById(req, res, next) {
    const id = req.params.id;
    const data = {
      cep: req.body.cep,
      number: req.body.number,
      city: req.body.city,
      state: req.body.state,
      complement: req.body.complement,
    };
    try {
      const result = await this.userService.updateUserAddressById(id, data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async updateUserLocationById(req, res, next) {
    const id = req.params.id;
    const data = {
      long: req.body.longetude,
      lat: req.body.latitude,
    };
    try {
      const result = await this.userService.updateUserLocationById(id, data);
      res.status(200).json(result);
      return next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async login(req, res, next) {
    const data = req.body;

    try {
      const result = await this.userService.login(data);

      res.status(200).json(result);
      return next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = UserController;
