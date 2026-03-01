import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    storeName: { type: String, required: true },
    address: String,
    geoAddress: String,
    pincode: String,
    district: String,
    storeType: String,

    ksbclId: String,
    ksbclPassword: String,

    laneAvailable: { type: String, enum: ["Yes", "No"], default: "No" },
    lanes: { type: Number, default: 0 },

    ownerName: String,
    ownerMobile: String,
    ownerEmail: String,

    cashierName: String,
    cashierMobile: String,

    goLiveDate: Date,
    renewalDate: Date,

    oneYearCharges: { type: Number, default: 0 },
    renewalAmount: { type: Number },

    systemRequired: { type: String, enum: ["Yes", "No"], default: "No" },
    systemAmount: { type: Number, default: 0 },

    leadGivenBy: String,
    onboardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },

    storeId: { type: String, unique: true, sparse: true },

    receivedAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Received"],
      default: "Pending",
    },

    paymentHistory: [
      {
        amount: { type: Number, required: true },
        updatedBy: { type: String, required: true },
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true },
);

/* =========================================================
   🔹 Helper: Calculate pendingAmount & paymentStatus
========================================================= */
function calculateAmounts(doc) {
  if (doc.systemRequired === "no") {
    doc.systemAmount = 0;
  }

  const totalAmount = (doc.oneYearCharges || 0) + (doc.systemAmount || 0);

  doc.pendingAmount = totalAmount - (doc.receivedAmount || 0);

  // Prevent negative pending
  if (doc.pendingAmount < 0) {
    doc.pendingAmount = 0;
  }

  // Only two statuses
  if (doc.pendingAmount === 0 && totalAmount > 0) {
    doc.paymentStatus = "Received";
  } else {
    doc.paymentStatus = "Pending";
  }
}

/* =========================================================
   🔹 Pre-save hook
========================================================= */
storeSchema.pre("save", function (next) {
  // Auto renewal date (1 year after goLiveDate)
  if (this.goLiveDate && !this.renewalDate) {
    const goLive = new Date(this.goLiveDate);
    const renewal = new Date(goLive);
    renewal.setFullYear(renewal.getFullYear() + 1);
    this.renewalDate = renewal;
  }

  calculateAmounts(this);
  next();
});

/* =========================================================
   🔹 Pre-update hook (findOneAndUpdate)
========================================================= */
storeSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (!update.$set) {
      update.$set = {};
    }

    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    const merged = {
      ...doc.toObject(),
      ...update.$set,
    };

    // Recalculate renewalDate if goLiveDate updated
    if (update.$set.goLiveDate) {
      const goLive = new Date(update.$set.goLiveDate);
      const renewal = new Date(goLive);
      renewal.setFullYear(renewal.getFullYear() + 1);
      merged.renewalDate = renewal;
    }

    // Recalculate payment
    calculateAmounts(merged);

    // Allow only specific fields from frontend
    const allowedFields = ["goLiveDate", "renewalDate", "receivedAmount"];

    const newSet = {};

    allowedFields.forEach((field) => {
      if (merged[field] !== undefined) {
        newSet[field] = merged[field];
      }
    });

    // Always update calculated fields
    newSet.pendingAmount = merged.pendingAmount;
    newSet.paymentStatus = merged.paymentStatus;

    update.$set = newSet;

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Store", storeSchema);
