const { Schema, model } = require("mongoose");

const BasketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        type: Object,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("basket", BasketSchema);
