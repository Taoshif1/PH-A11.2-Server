const { ObjectId } = require("mongodb");

class UserModel {
  constructor(collection) {
    this.collection = collection;
  }

  async create(user) {
    const doc = {
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      bloodGroup: user.bloodGroup,
      district: user.district,
      upazila: user.upazila,

      role: "donor",
      status: "active",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.collection.insertOne(doc);
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getAll(filter = {}) {
    return await this.collection.find(filter).toArray();
  }

  async updateProfile(id, data) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    );
  }

  async updateRole(id, role) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } },
    );
  }

  async updateStatus(id, status) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } },
    );
  }
}

module.exports = UserModel;
