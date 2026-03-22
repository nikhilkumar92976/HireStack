import axios from "axios";

export const getTechJobs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const response = await axios.get(
      "https://jsearch.p.rapidapi.com/search",
      {
        params: {
          query: "software developer OR frontend OR backend OR full stack",
          page: String(page),
          num_pages: "1"
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
      }
    );

    const jobs = Array.isArray(response?.data?.data) ? response.data.data : [];

    res.json({ page, jobs });
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
};