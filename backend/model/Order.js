const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [{ type: Schema.Types.Mixed, required: true }],
    totalItems: { type: Number },
    totalAmount: { type: Number },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports.Order = mongoose.model("Order", orderSchema);
