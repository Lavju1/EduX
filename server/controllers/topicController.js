const Topic = require("../models/topicModel");
const Tag = require("../models/tagModel");
const Comment = require("../models/commentModel");
const Space = require("../models/spaceModel");

module.exports = {
  getAllTopics: async (req, res) => {
      try {
        const { search, sort, space } = req.query; // Add 'space' to the destructured query
  
        let sortOptions = {};
        let searchQuery = {};
  
        if (search && search.length > 0) {
          searchQuery = { title: new RegExp(search, "i") };
        }
  
        if (sort === "latest") {
          sortOptions = { createdAt: -1 };
        } else if (sort === "popular") {
          sortOptions = { viewsCount: -1 };
        } else if (sort === "most_replied") {
          sortOptions = { totalComments: -1 };
        } else if (sort === "most_upvoted") {
          sortOptions = { upvotes: -1 };
        }
  
        // Filter by space if 'space' query param is provided
        let spaceQuery = {};
        if (space) {
          spaceQuery = { spaces: id }; // Assuming 'space' is the ID of the selected space
        }
  
        let topics = await Topic.find({ ...searchQuery, ...spaceQuery }) // Combine search and space queries
          .sort(sortOptions)
          .populate("tags")
          .populate({ path: "author", select: { password: 0, __v: 0 } })
          .lean()
          .exec();
  
        return res.json(topics);
      } catch (err) {
        console.log(err.message);
      }
    },
    
  
  getTopic: async (req, res) => {
    const { slug } = req.params;
    try {
      const topic = await Topic.findOneAndUpdate(
        { slug },
        {
          $inc: { viewsCount: 1 },
        },
        { returnOriginal: false }
      )
        .populate("tags")
        .populate({ path: "author", select: { password: 0, __v: 0 } })
        .lean()
        .exec();
      return res.status(200).json(topic);
    } catch (err) {
      console.log(err.message);
    }
  },
  addTopic: async (req, res) => {
    try {
      const { title, content, selectedSpace, selectedTags } = req.body;

      // Create an array to store space IDs
      console.log("this is req.body: ", req.body);
      let createdSpaces = [];

      for (let index = 0; index < selectedSpace.length; index++) {
        let spaceName = selectedSpace[index]; // Assuming selectedSpace contains space names

        // Check if the space already exists
        let spaceFound = await Space.findOne({ name: spaceName });

        if (!spaceFound) {
          // Create the space if it doesn't exist
          let space = await Space.create({
            name: spaceName,
            createdBy: req.user.username,
          });
          createdSpaces.push(space._id); // Push the space ID to the array
        } else {
          createdSpaces.push(spaceFound._id); // Use existing space ID
        }
      }

      const slug = title
        .toString()
        .normalize("NFKD")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\_/g, "-")
        .replace(/\-\-+/g, "-")
        .replace(/\-$/g, "");

      let topic = await Topic.create({
        owner: req.user.username,
        title: title.trim(),
        content: content.trim(),
        slug: slug.trim(),
        spaces: createdSpaces, // Assign the array of space IDs to the topic
        tags: selectedTags,
      });

      // Populate the author field
      topic = await topic.populate({
        path: "author",
        select: { password: 0, __v: 0 },
      });

      return res.status(201).json({
        topic: topic,
        message: "Topic successfully created!",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  deleteTopic: async (req, res) => {
    try {
      const { id } = req.params;
      const topic = await Topic.findById(id).populate("author", {
        _id: 0,
        username: 1,
      });
      if (!topic) {
        return res.status(404).json({
          message: "Could not find topic for the provided ID.",
        });
      }
      if (req.user.username !== topic.author.username) {
        return res.status(403).json({
          message: "You are not allowed to delete this topic",
        });
      }
      await Comment.deleteMany({ parentTopic: id });
      await Topic.findByIdAndDelete(id);
      return res.json({ topicId: id, message: "Topic deleted successfully!" });
    } catch (err) {
      console.log(err.message);
    }
  },
  toggleUpvoteTopic: async (req, res) => {
    const { id } = req.params;
    try {
      const topic = await Topic.findById(id);
      if (!topic) {
        return res.status(404).json({
          message: "Topic not found!",
        });
      }
      if (topic.upvotes.includes(req.user.username)) {
        topic.upvotes.pull(req.user.username);
        await topic.save();
        return res.status(200).json({
          topicId: id,
          username: req.user.username,
          message: "Topic was upvoted successfully.",
        });
      } else {
        topic.upvotes.push(req.user.username);
        topic.downvotes.pull(req.user.username);
        await topic.save();
        return res.status(200).json({
          topicId: id,
          username: req.user.username,
          message: "Topic was upvoted successfully.",
        });
      }
    } catch (err) {
      return res.status(403).json({
        Error: err.message,
      });
    }
  },
  toggleDownvoteTopic: async (req, res) => {
    const { id } = req.params;
    try {
      const topic = await Topic.findById(id);
      if (!topic) {
        return res.status(404).json({
          message: "Topic not found!",
        });
      }
      if (topic.downvotes.includes(req.user.username)) {
        topic.downvotes.pull(req.user.username);
        await topic.save();
        return res.status(200).json({
          topicId: id,
          username: req.user.username,
          message: "Topic was downvoted successfully.",
        });
      } else {
        topic.downvotes.push(req.user.username);
        topic.upvotes.pull(req.user.username);
        await topic.save();
        return res.status(200).json({
          topicId: id,
          username: req.user.username,
          message: "Topic was downvoted successfully.",
        });
      }
    } catch (err) {
      return res.status(403).json({
        Error: err.message,
      });
    }
  },
  getTopContributors: async (req, res) => {
    try {
      let topContributors = await Topic.aggregate([
        { $group: { _id: "$owner", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "username",
            as: "author",
            pipeline: [{ $project: { password: 0, __v: 0 } }],
          },
        },
        { $unwind: "$author" },
        { $limit: 3 },
      ]);
      return res.status(200).json(topContributors);
    } catch (err) {
      console.log(err.message);
    }
  },
  getSpaces: async (req, res) => {
    try {
      const spaces = await Space.find({});
      const { space } = req.query;
      let spaceQuery = {};
      if (space) {
        spaceQuery = { spaces: id }; // Assuming 'space' is the ID of the selected space
      }
      return res.status(200).json(spaces);
    } catch (err) {
      console.log(err.message);
    }
  },
};
