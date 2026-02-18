import Test from "../models/Test.js";

const roundIELTS = (score) => Math.floor(score * 2) / 2;

export const addTest = async (req, res) => {
  try {
    const { skill, bandScore, mistakes, testDate, mockName, mockLink, fullScores } = req.body;

    if (skill === "full") {
      const { reading, listening, writing, speaking } = fullScores || {};
      if ([reading, listening, writing, speaking].some(s => s == null || s < 0 || s > 9)) {
        return res.status(400).json({ message: "All 4 band scores are required for a full mock." });
      }
      const avg = (reading + listening + writing + speaking) / 4;
      const overall = roundIELTS(avg);
      const test = await Test.create({
        user: req.user._id,
        skill: "full",
        bandScore: overall,
        fullScores: { reading, listening, writing, speaking },
        mistakes, testDate, mockName, mockLink,
      });
      return res.status(201).json(test);
    }

    const test = await Test.create({
      user: req.user._id,
      skill, bandScore, mistakes, testDate, mockName, mockLink,
    });
    res.status(201).json(test);
  } catch (err) {
    console.error("ADD TEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTestsBySkill = async (req, res) => {
  const { skill } = req.params;
  const tests = await Test.find({ user: req.user._id, skill }).sort({ testDate: -1 });
  res.json(tests);
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, user: req.user._id });
    if (!test) return res.status(404).json({ message: "Test not found" });
    await test.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE TEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};