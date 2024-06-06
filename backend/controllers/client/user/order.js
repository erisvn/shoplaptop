const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

module.exports = {
  list: async (req, res) => {
    const list = await prisma.orders.findMany({
      where: {
        user_id: req.user.id,
      },
      include: {
        address: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json({ status: 200, data: list });
  },
  info: async (req, res) => {
    const id = req.query.id;
    const info = await prisma.orders.findFirst({
      where: {
        user_id: req.user.id,
        id: parseInt(id),
      },
      include: {
        address: true,
        OrderDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!info) {
      return res.json({ status: -100, msg: "Không tìm thấy đơn hàng" });
    }

    return res.json({ status: 200, data: info });
  },
};
