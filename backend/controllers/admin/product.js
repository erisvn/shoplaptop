const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

module.exports = {
  list: async (req, res) => {
    const { category, page, itemsPerPage } = req.body;
    const current_page = page ?? 1;
    const per_page = itemsPerPage ?? 10;
    const total = await prisma.products.count();

    const list = await prisma.products.findMany({
      skip: (current_page - 1) * per_page,
      take: per_page,
      where: {
        ...(category && { category_id: category }),
      },
      select: {
        id: true,
        category_id: true,
        slug: true,
        name: true,
        price: true,
        status: true,
        created_at: true,
        images: true,
        category: true,
        stock_status: true,
      },
    });

    return res.json({
      status: 200,
      data: list,
      paginate: { current_page, per_page, total },
    });
  },
  info: async (req, res) => {
    const id = req.query.id;

    if (!id) {
      return res.status(200).json({ status: -100, msg: "Thiếu tham số" });
    }

    const info = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        images: true,
      },
    });

    if (!info) {
      return res.json({ status: -100, msg: "Không tìm thấy sản phẩm" });
    }

    return res.json({ status: 200, data: info });
  },
  create: async (req, res) => {
    const {
      name,
      slug,
      short_description,
      description,
      images,
      price,
      discount_price,
      stock_status,
      category_id,
      status,
    } = req.body;

    if (
      !name ||
      !slug ||
      !description ||
      !images ||
      !price ||
      !stock_status ||
      !category_id
    ) {
      return res.status(200).json({ status: -100, msg: "Thiếu tham số" });
    }

    const exist = await prisma.products.findFirst({
      where: {
        slug: slug,
      },
    });

    if (exist) {
      return res.json({
        status: -100,
        msg: "Sản phẩm với slug đã tồn tại, vui lòng dùng slug khác",
      });
    }

    const product = await prisma.products.create({
      data: {
        brand_id: null,
        category_id: parseInt(category_id),
        slug: slug,
        name: name,
        short_description: short_description,
        description: description,
        price: parseInt(price),
        discount: parseInt(discount_price),
        stock_status: stock_status,
        status: status,
      },
    });

    for (const image of images) {
      const base64Data = image.url.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `uploads/image_${Date.now()}.png`;

      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          console.error(err);
        }
      });

      await prisma.productImages.create({
        data: {
          product_id: product.id,
          image_url: `http://localhost:4000/${fileName}`,
        },
      });
    }

    return res
      .status(201)
      .json({ status: 200, msg: "Đăng sản phẩm thành công" });
  },
  update: async (req, res) => {
    const {
      id,
      name,
      slug,
      short_description,
      description,
      images,
      price,
      discount_price,
      stock_status,
      category_id,
      status,
    } = req.body;

    if (
      !name ||
      !slug ||
      !description ||
      !images ||
      !price ||
      !stock_status ||
      !category_id
    ) {
      return res.status(200).json({ status: -100, msg: "Thiếu tham số" });
    }

    const product = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.json({ status: -100, msg: "Không tìm thấy sản phẩm" });
    }

    await prisma.products.update({
      where: {
        id: product.id,
      },
      data: {
        brand_id: null,
        category_id: parseInt(category_id),
        slug: slug,
        name: name,
        short_description: short_description,
        description: description,
        price: parseInt(price),
        discount: parseInt(discount_price),
        stock_status: stock_status,
        status: status,
      },
    });

    for (const image of images) {
      if (!image.uploaded) {
        const base64Data = image.image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `uploads/image_${Date.now()}.png`;

        fs.writeFile(fileName, buffer, (err) => {
          if (err) {
            console.error(err);
          }
        });

        await prisma.productImages.create({
          data: {
            product_id: product.id,
            image_url: `http://localhost:4000/${fileName}`,
          },
        });
      }
    }

    return res.json({ status: 200, msg: "Cập nhật thành công" });
  },
  delete: async (req, res) => {
    const id = req.body.id;

    if (!id) {
      return res.status(200).json({ status: -100, msg: "Thiếu tham số" });
    }

    const product = await prisma.products.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return res.json({ status: -100, msg: "Không tìm thấy sản phẩm" });
    }

    await prisma.products.update({
      where: {
        id: product.id,
      },
      data: {
        status: 1,
      },
    });
    return res.json({ status: 200, msg: "Xoá thành công" });
  },
  delete_image: async (req, res) => {
    const id = req.body.id;

    if (!id) {
      return res.status(200).json({ status: -100, msg: "Thiếu tham số" });
    }

    const image = await prisma.productImages.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!image) {
      return res.json({ status: -100, msg: "Không tìm thấy sản phẩm" });
    }

    await prisma.productImages.delete({
      where: {
        id: image.id,
      },
    });
    return res.json({ status: 200, msg: "Xoá thành công" });
  },
};
