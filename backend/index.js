const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const router = express.Router();
require("express-group-routes");
require("dotenv").config();

const app = express();
const port = 4000;
app.use(
  cors({
    origin: "*",
  }),
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  }),
  bodyParser.json({
    limit: "100mb",
  })
);

app.use("/uploads", express.static("uploads"));
const auth = require("./middleware/auth.js");

// khách hàng
app.group("/api/", (router) => {
  // trang chủ
  router.group("/home/", (router) => {
    const homeController = require("./controllers/client/home.js");

    router.post("/categoryList", homeController.categoryList);
    router.post("/productList", homeController.productList);
  });
  // sản phẩm
  router.group("/product/", (router) => {
    const productController = require("./controllers/client/product.js");

    router.post("/info", productController.info);
  });
  router.group("/order", (router) => {
    const orderController = require("./controllers/client/order.js");

    router.use(auth).post("/submit", orderController.submit);
  });
  // danh mục
  router.group("/category/", (router) => {
    const categoryController = require("./controllers/client/category.js");

    router.post("/productList", categoryController.productList);
  });
  // xác thực
  router.group("/auth/", (router) => {
    const authController = require("./controllers/client/auth.js");

    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.use(auth).post("/me", authController.user);
  });
  // người dung
  router.use(auth).group("/user", (router) => {
    // địa chỉ
    router.group("/address", (router) => {
      const adddressController = require("./controllers/client/user/address.js");

      router.get("/info", adddressController.info);
      router.get("/list", adddressController.list);
      router.post("/create", adddressController.create);
      router.put("/update", adddressController.update);
      router.delete("/delete", adddressController.delete);
    });

    // đơn hàng
    router.group("/orders", (router) => {
      const orderController = require("./controllers/client/user/order.js");

      router.get("/list", orderController.list);
      router.get("/info", orderController.info);
    });
  });

  // admin
  router.group("/admin/", (router) => {
    router.group("/product", (router) => {
      const productController = require("./controllers/admin/product.js");

      router.post("/list", productController.list);
      router.post("/create", productController.create);
      router.get("/info", productController.info);
      router.put("/update", productController.update);
      router.delete("/delete", productController.delete);

      router.group("/image", (router) => {
        router.delete("/delete", productController.delete_image);
      });
    });

    router.group("/category", (router) => {
      const categoryController = require("./controllers/admin/category.js");

      router.post("/list", categoryController.list);
      router.get("/info", categoryController.info);
      router.post("/create", categoryController.create);
      router.put("/update", categoryController.update);
      router.delete("/delete", categoryController.delete);
    });

    router.group("/orders", (router) => {
      const categoryController = require("./controllers/admin/order.js");

      router.get("/list", categoryController.list);
      router.get("/info", categoryController.info);
      router.put("/update", categoryController.update);
    });
  });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
