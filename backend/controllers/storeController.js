import Store from "../models/Store.js";

// Create a store (protected)
export const createStore = async (req, res) => {
  try {
    const store = await Store.create({
      ...req.body,
      onboardedBy: req.user.id,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStores = async (req, res) => {
  try {
    const { status, paymentStatus, renewal } = req.query;

    let filter = {};

    // 🔹 Filter by store status
    if (status) {
      filter.status = status;
    }

    // 🔹 Filter by payment status
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    // 🔹 Renewal within next 2 months + expired
    if (renewal === "true") {
      const today = new Date();
      const nextTwoMonths = new Date();
      nextTwoMonths.setMonth(today.getMonth() + 2);

      filter.renewalDate = {
        $lte: nextTwoMonths, // include expired + upcoming 2 months
      };
    }

    const stores = await Store.find(filter)
      .populate("onboardedBy", "username role")
      .sort({ renewalDate: 1 }); // soonest renewal first

    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stores of logged-in user (if you track owner)
export const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({
      onboardedBy: req.user.id,
    }).populate("onboardedBy", "username role");

    res.status(200).json({ stores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({
      message: "Store updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renewStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // 2️⃣ Update renewal date (+1 year)
    const newRenewalDate = store.renewalDate
      ? new Date(store.renewalDate)
      : new Date();
    newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1);
    store.renewalDate = newRenewalDate;

    await store.save();

    res.status(200).json({
      message: "Store renewed successfully",
      store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.deleteOne(); // delete from DB

    return res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Delete Store Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { receivedAmount } = req.body;

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { $set: { receivedAmount } },
      { new: true, runValidators: true },
    );

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({
      message: "Payment updated successfully",
      store: updatedStore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
