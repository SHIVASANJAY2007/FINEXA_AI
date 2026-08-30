import * as dbService from '../database/dbService.js';

export const createPlan = async (req, res, next) => {
  const {
    personId,
    source,
    destination,
    dateOfGoing,
    dateOfReturning,
    activities,
    modeOfTransport,
    hotelRequired,
    hotelName,
    carRent
  } = req.body;

  if (!personId || !source || !destination) {
    return res.status(400).json({ error: "personId, source, and destination are required fields." });
  }

  try {
    const user = await dbService.findUserById(personId);
    if (!user) {
      return res.status(400).json({ error: `User with ID ${personId} does not exist.` });
    }

    const plan = await dbService.createTravelPlan({
      person_id: personId,
      source,
      destination,
      date_of_going: dateOfGoing,
      date_of_returning: dateOfReturning,
      activities,
      mode_of_transport: modeOfTransport,
      hotel_required: hotelRequired,
      hotel_name: hotelName,
      car_rent: carRent
    });

    res.status(201).json({
      message: "Travel plan created successfully.",
      plan
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPlans = async (req, res, next) => {
  const { personId } = req.params;

  if (!personId) {
    return res.status(400).json({ error: "User ID param is required." });
  }

  try {
    const plans = await dbService.getTravelPlansByUser(personId);
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid travel plan ID." });
  }

  try {
    const plan = await dbService.getTravelPlanById(id);
    if (!plan) {
      return res.status(404).json({ error: "Travel plan not found." });
    }
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const {
    source,
    destination,
    dateOfGoing,
    dateOfReturning,
    activities,
    modeOfTransport,
    hotelRequired,
    hotelName,
    carRent
  } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid travel plan ID." });
  }

  try {
    const existingPlan = await dbService.getTravelPlanById(id);
    if (!existingPlan) {
      return res.status(404).json({ error: "Travel plan not found." });
    }

    const updatedPlan = await dbService.updateTravelPlan(id, {
      source,
      destination,
      date_of_going: dateOfGoing,
      date_of_returning: dateOfReturning,
      activities,
      mode_of_transport: modeOfTransport,
      hotel_required: hotelRequired,
      hotel_name: hotelName,
      car_rent: carRent
    });

    res.status(200).json({
      message: "Travel plan updated successfully.",
      plan: updatedPlan
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid travel plan ID." });
  }

  try {
    const success = await dbService.deleteTravelPlan(id);
    if (!success) {
      return res.status(404).json({ error: "Travel plan not found or already deleted." });
    }
    res.status(200).json({ message: "Travel plan deleted successfully." });
  } catch (error) {
    next(error);
  }
};
