exports.getHomePage = async (req, res) => {
  try {
    res.sendFile("index.html", { root: "views" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
