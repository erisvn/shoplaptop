const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productController = {
  info: async (req, res) => {
    try {
      const productSlug = req.body.slug;

      const product = await prisma.products.findFirst({
        where: {
          slug: productSlug,
        },
        include: {
          images: true,
        },
      });

      if (!product) {
        return res
          .status(200)
          .json({ status: -100, msg: "Không tìm thấy sản phẩm" });
      }

      if (product.status != 0) {
        return res
          .status(400)
          .json({ status: -100, msg: "Sản phẩm không bán nữa" });
      }

      return res.status(200).json({ status: 200, data: product });
    } catch (error) {
      return res.status(200).json({ statys: 400, msg: error.message });
    }
  },
};

module.exports = productController;
