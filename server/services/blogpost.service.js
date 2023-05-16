const blogpostModel = require("../models/blogpost.model");

exports.save = async (data) => {
    const blog = new blogpostModel(data);
    return await blog.save();
};

exports.update = async (matchQuery, updateData) => {
    const update = await blogpostModel.updateMany(matchQuery, {
        $set: updateData
    });
    return update;
};

exports.updateOne = async (matchQuery, updateData) => {
    const blog = await blogpostModel.findOneAndUpdate(matchQuery, updateData);
    return blog;
};

exports.findOne = async (data) => {
    return await blogpostModel.findOne(data).lean();
};

exports.findAll = async ({ page, limit }) => {
    const mongoQuery = [
        {
            $lookup: {
                from: "admins",
                localField: "adminId",
                foreignField: "id",
                as: "adminDetails"
            }
        },
        { $project: { __v: 0, _id: 0 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ]
    return await blogpostModel.aggregate(mongoQuery)
};

exports.deleteOne = async (data) => {
    return await blogpostModel.findOneAndDelete(data);
};

exports.findAllByFilter = async (filter) => {
    return await blogpostModel.find(filter);
};

exports.findOneByFilter = async (filter) => {
    return await blogpostModel.findOne(filter).lean();
};