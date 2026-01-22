import {
  getAllToursService,
  getTourByIdService,
  getTourByNameService,
  createTourService,
  updateTourService,
  deleteTourService,
  getMnthlyPlan,
  getTourStatsService
} from "../services/tourService.js";
//import {createTourSchema} from '../Validators/auth_validate.js';
export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "rating,price";
  req.query.fields = "name,price,rating";
  next();
};

export const getAlltours = async (req, res) => {
  try {
    const tours = await getAllToursService(req.query);

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

export const getTourByid = async (req, res) => {
  try {
    const tour = await getTourByIdService(req.params.id);
    if (!tour) return res.status(404).json({ status: "fail", message: "Not found" });

    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getTourByName = async (req, res) => {
  try {
    const tour = await getTourByNameService(req.params.name);
    if (!tour) return res.status(404).json({ status: "fail", message: "Not found" });

    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const createTour = async (req, res) => {
  try {  
      const tourData = req.validated || req.body;
    const tour = await createTourService(tourData);
    res.status(201).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

export const updateTour = async (req, res) => {
  try {
        const data = req.validated || req.body;

    const tour = await updateTourService(req.params.id, data);
    res.status(200).json({ status: "success", data: { tour } });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await deleteTourService(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

export const getTourStart = async (req, res) => {
  try {
    const stats = await getTourStatsService();
    res.status(200).json({ status: "success", results: stats.length, data: stats });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};


export const monthlyplan = async (req, res) => {
    try {
      const month = req.params.month * 1;
      const plan = await getMnthlyPlan();
      res.status(200).json({ status: "success", results: plan.length, data: plan });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
}
