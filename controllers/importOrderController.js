const Product = require("../models/productModel");
const ImportOrder = require("../models/importOrderModel");

exports.createImportOrder = async (req, res) => {
  try {
    const { code, items } = req.body;

    // Đảm bảo mỗi item có received = 0 ban đầu
    const newItems = items.map((item) => ({
      ...item,
      received: 0,
    }));

    const order = await ImportOrder.create({
      code,
      items: newItems,
      status: "doing",
    });

    // await createProduct({code,name,quantity});

    // Tạo sản phẩm nếu chưa có (với số lượng hiện tại = 0)
    for (const item of items) {
      let product = await Product.findOne({ code: item.productCode });
      if (!product) {
        await Product.create({
          code: item.productCode,
          name: item.productName,
          quantity: 0,
        });
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllImportOrders = async (req, res) => {
  try {
    const orders = await ImportOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateImportOrder = async (req, res) => {
  try {
    // Lấy mã đơn nhập và danh sách sản phẩm cần cập nhật từ request body
    const { code, items } = req.body;

    // Tìm đơn nhập hàng trong database theo mã đơn
    const order = await ImportOrder.findOne({ code });
    if (!order) {
      // Nếu không tìm thấy, trả về lỗi 404
      return res.status(404).json({ message: "Import order not found" });
    }
    console.log("order", order)
    console.log("items", items)
    // Cập nhật từng sản phẩm trong đơn nhập
    const updatedItems = order.items.map((existingItem) => {
      // Tìm sản phẩm tương ứng trong danh sách cập nhật gửi từ client
      const updateItem = items.find(
        (i) => i.productCode === existingItem.productCode
      );

      // Nếu không có thông tin cập nhật, giữ nguyên sản phẩm cũ
      if (!updateItem) return existingItem;

      // Tính số lượng còn lại chưa nhận
      const remaining = existingItem.quantity - existingItem.received;

      // Tính số lượng thực tế sẽ cộng thêm (không vượt quá phần còn lại)
      const addAmount = Math.min(updateItem.quantity, remaining);

      console.log("existingItem",existingItem)
      console.log("updateItem",updateItem)
      console.log("remaining",remaining)

      // Nếu có số lượng cần cộng thêm
      if (addAmount > 0) {
        // Cập nhật tồn kho của sản phẩm tương ứng
        Product.findOne({ code: existingItem.productCode }).then((product) => {
          if (product) {
            product.quantity += addAmount; // Cộng thêm vào số lượng tồn kho
            product.save(); // Lưu lại thay đổi
          }
        });
      }

      // Trả về sản phẩm với số lượng 'received' đã được cập nhật
      return {
        ...existingItem.toObject(),
        received: existingItem.received + addAmount,
      };
    });

    // Gán lại danh sách sản phẩm đã cập nhật vào đơn hàng
    order.items = updatedItems;

    // Cập nhật trạng thái đơn hàng: 'done' nếu tất cả đã nhận đủ, ngược lại là 'doing'
    order.status = updatedItems.every((i) => i.received >= i.quantity)
      ? "done"
      : "doing";
    console.log("order.status", order.status) 
    // Lưu đơn hàng đã cập nhật vào database
    await order.save();

    // Trả kết quả đơn hàng đã cập nhật về cho client
    res.json(order);
  } catch (err) {
    // Xử lý lỗi nếu có lỗi xảy ra trong quá trình xử lý
    res.status(500).json({ message: err.message });
  }
};


exports.deleteImportOrder = async (req, res) => {
  try {
    const { _id } = req.body;

    const order = await ImportOrder.findByIdAndDelete(_id);
    if (!order) {
      return res.status(404).json({ message: "Import order not found" });
    }

    res.json({ message: "Import order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
