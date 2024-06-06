const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categoryController = {
  productList: async (req, res) => {
    try {
      const categorySlug = req.body.slug.toString();

      if (!categorySlug) {
        return res.status(200).json({ status: 400, msg: "Thiếu tham số" });
      }

      const category = await prisma.categories.findFirst({
        where: {
          slug: categorySlug,
        },
      });

      if (!category) {
        return res
          .status(200)
          .json({ status: 400, msg: "Không tìm thấy danh mục" });
      }

      const productList = await prisma.products.findMany({
        where: {
          category_id: category.id,
          status: 0,
        },
        include: {
          images: true,
          reviews: true,
        },
      });

      for (const product of productList) {
        const totalReviews = product.reviews.length;
        let totalRating = 0;
        if (totalReviews > 0) {
          totalRating = product.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
        }
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        // thêm thông tin số lượng đánh giá và rating trung bình vào mỗi sản phẩm
        product.totalReviews = totalReviews;
        product.avgRating = averageRating.toFixed(1);

        delete product.reviews;
      }

      res
        .status(200)
        .json({ status: 200, data: productList, category: category });
    } catch (error) {
      res.status(200).json({ statys: 400, msg: error.message });
    }
  },
};

module.exports = categoryController;
