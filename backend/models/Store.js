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
    renewalAmount: { type: Number, default: 0 },
    isRenewed: { type: Boolean, default: false },
    systemRequired: { type: String, enum: ["Yes", "No"], default: "No" },
    systemAmount: { type: Number, default: 0 },
    leadGivenBy: String,
    onboardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
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

// =========================================================
// 🔹 Helper: Calculate pendingAmount & paymentStatus
// =========================================================
function calculateAmounts(doc) {
  if (doc.systemRequired === "No") doc.systemAmount = 0;

  let totalAmount;
  if (doc.isRenewed) {
    totalAmount = doc.renewalAmount || 0;
  } else {
    totalAmount = (doc.oneYearCharges || 0) + (doc.systemAmount || 0);
  }

  doc.pendingAmount = totalAmount - (doc.receivedAmount || 0);
  if (doc.pendingAmount < 0) doc.pendingAmount = 0;

  doc.paymentStatus =
    doc.pendingAmount === 0 && totalAmount > 0 ? "Received" : "Pending";
}

// =========================================================
// 🔹 Pre-save hook
// =========================================================
storeSchema.pre("save", function (next) {
  // Auto renewalDate
  if (this.goLiveDate && !this.renewalDate) {
    const goLive = new Date(this.goLiveDate);
    const renewal = new Date(goLive);
    renewal.setFullYear(renewal.getFullYear() + 1);
    this.renewalDate = renewal;
  }

  // Calculate initial pendingAmount and paymentStatus
  const totalAmount =
    (this.oneYearCharges || 0) +
    (this.systemRequired === "Yes" ? this.systemAmount || 0 : 0);
  this.pendingAmount = totalAmount - (this.receivedAmount || 0);
  if (this.pendingAmount < 0) this.pendingAmount = 0;
  this.paymentStatus =
    this.pendingAmount === 0 && totalAmount > 0 ? "Received" : "Pending";

  next();
});

// =========================================================
// 🔹 Pre-update hook (findOneAndUpdate)
// =========================================================
storeSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (!update.$set) update.$set = {};

    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();

    // Update renewalDate if goLiveDate changes
    if (update.$set.goLiveDate) {
      const goLive = new Date(update.$set.goLiveDate);
      const renewal = new Date(goLive);
      renewal.setFullYear(renewal.getFullYear() + 1);
      update.$set.renewalDate = renewal;
    }

    // Merge current doc and updates for calculation
    const merged = { ...doc.toObject(), ...update.$set };
    calculateAmounts(merged);

    // Update calculated fields
    update.$set.pendingAmount = merged.pendingAmount;
    update.$set.paymentStatus = merged.paymentStatus;

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Store", storeSchema);
