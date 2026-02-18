import Test from "../models/Test.js";
import { calculateOverallBand } from "../utils/bandCalculator.js";

export const getDashboardData = async (req, res) => {
     console.log("USER:", req.user.name, req.user.email); // ← temporary
  const tests = await Test.find({ user: req.user._id });

  const skills = {
    reading: [],
    listening: [],
    writing: [],
    speaking: [],
  };

  tests.forEach((t) => {
    // Skip full mocks — they're not individual skill tests
    if (t.skill === "full") return;
    skills[t.skill].push(t.bandScore);
  });

  const averages = {};
  for (let skill in skills) {
    averages[skill] =
      skills[skill].length > 0
        ? calculateOverallBand(skills[skill])
        : 0;
  }

  const overallBand = calculateOverallBand(
    Object.values(averages).filter((b) => b > 0)
  );

res.json({
  name: req.user.name,      // ← add this
  email: req.user.email,    // ← and this as fallback
  averages,
  overallBand,
  targetBand: req.user.targetBand || 8.0,
});
};