const Price = require("../models/priceModel");

// Tạo mới một price
exports.createPrice = async (req, res) => {
  try {
    const { price1, price2, createDate } = req.body;

    const newPrice = new Price({
      price1,
      price2,
      createDate,
    });

    const savedPrice = await newPrice.save();
    res.status(201).json(savedPrice);
  } catch (error) {
    console.error("Lỗi tạo price:", error);
    res.status(500).json({ error: "Không thể tạo price" });
  }
};

// ✅ Hàm lấy tất cả price
exports.getAllPrices = async (req, res) => {
  try {
    const prices = await Price.find();
    res.status(200).json(prices);
  } catch (error) {
    console.error("Lỗi lấy danh sách price:", error);
    res.status(500).json({ error: "Không thể lấy danh sách price" });
  }
};
