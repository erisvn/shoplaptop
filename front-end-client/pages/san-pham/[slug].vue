<template>
  <div>
    <div class="container mx-auto mt-5">
      <div class="text-base">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }" class="text-base"
            >Trang hủ</el-breadcrumb-item
          >
          <el-breadcrumb-item class="text-base">{{
            product?.data.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="bg-white rounded-md mt-4">
        <div class="grid grid-cols-12 divide-x">
          <div
            class="col-span-12 xl:col-span-4 lg:col-span-5 md:col-span-4 p-5"
          >
            <img
              :src="
                product?.data.images.length
                  ? product?.data.images[0].image_url
                  : 'https://i.imgur.com/igbbIRf.png'
              "
              alt=""
              class="rounded-sm w-full aspect-[10/10] object-cover"
              srcset=""
            />
            <div class="grid grid-cols-10 mt-4 gap-5">
              <div
                class="col-span-2"
                v-if="product?.data.images.length"
                v-for="image in product?.data.images"
              >
                <img
                  :src="image.image_url"
                  alt=""
                  srcset=""
                  class="object-cover w-full h-full border"
                />
              </div>
            </div>
          </div>
          <div
            class="col-span-12 xl:col-span-8 lg:col-span-7 md:col-span-8 p-5"
          >
            <h1 class="text-2xl font-semibold">
              {{ product?.data.name }}
            </h1>
            <div class="flex gap-3 mt-2">
              <div class="text-base text-amber-600 font-semibold">
                0.0 <i class="text-xs bi bi-star-fill"></i>
              </div>
              <div class="text-base text-gray-700">
                (0 đánh giá) {{ cart.cart.length }}
              </div>
            </div>
            <div class="flex gap-4 mt-5">
              <div class="text-3xl font-semibold text-red-600">
                {{
                  (product?.data.price ?? 0).toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
              <span
                class="line-through text-xl text-gray-500 me-3"
                v-if="product?.data.discount"
              >
                {{
                  (product?.data.discount ?? 0).toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </span>
              <span
                class="text-red-600 text-sm px-[4px] py-[1px] bg-red-100 border border-red-500 rounded-sm h-fit"
                v-if="product?.data.discount"
                >-5%</span
              >
            </div>
            <div
              class="text-center md:min-w-[400px] md:w-fit w-full bg-red-600 text-white py-2 rounded-md mt-5 cursor-pointer"
              @click="cart.add(product?.data.slug ?? '')"
            >
              <div class="text-lg">MUA NGAY</div>
              <div>Giao tận nơi hoặc nhận tại của hàng</div>
            </div>

            <div
              class="mt-4 text-lg border-t pt-4"
              v-if="product?.data.short_description"
              v-html="product?.data.short_description"
            ></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-12 mt-4 gap-4">
        <div class="col-span-12 md:col-span-8 bg-white rounded-md p-4">
          <h2 class="text-2xl">THÔNG TIN SẢN PHẨM</h2>
          <div class="relative" id="content">
            <div
              v-html="product?.data.description"
              :style="show_more ? '' : height()"
              class="overflow-hidden mt-3"
            ></div>
            <div
              v-if="show_more == false"
              @click="
                () => {
                  show_more = true;
                }
              "
            >
              <div
                class="absolute bottom-10 h-[280px] w-full"
                style="
                  background: linear-gradient(
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.1) 40%,
                    #fff
                  );
                "
              ></div>
              <div
                class="absolute w-full text-center py-2 text-blue-600 bg-white bottom-0 text-base cursor-pointer"
              >
                XEM CHI TIẾT
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-12 md:col-span-4"
          :class="show_more ? '' : 'h-fit'"
          id="content-2"
        >
          <div class="sticky top-[95px]">
            <div class="bg-white round-md p-4 h-fit">
              <h2 class="text-2xl">CẤU HÌNH</h2>
              <table class="table w-full border border-collapse mt-3">
                <tr class="bg-zinc-200">
                  <td class="py-3 px-4">SDD</td>
                  <td class="py-3 px-4">512 GB</td>
                </tr>
                <tr>
                  <td class="py-3 px-4">RAM</td>
                  <td class="py-3 px-4">16 GB</td>
                </tr>
                <tr class="bg-zinc-200">
                  <td class="py-3 px-4">VGA</td>
                  <td class="py-3 px-4">Onboard</td>
                </tr>
                <tr>
                  <td class="py-3 px-4">CPU</td>
                  <td class="py-3 px-4">i5-13500H</td>
                </tr>
              </table>
            </div>
            <div class="bg-white round-md p-4 mt-3 h-fit">
              <h2 class="text-2xl">SẢN PHẨM TƯƠNG TỰ</h2>
              <table class="table w-full border border-collapse mt-3">
                <tr class="bg-zinc-200">
                  <td class="py-3 px-4">SDD</td>
                  <td class="py-3 px-4">512 GB</td>
                </tr>
                <tr>
                  <td class="py-3 px-4">RAM</td>
                  <td class="py-3 px-4">16 GB</td>
                </tr>
                <tr class="bg-zinc-200">
                  <td class="py-3 px-4">VGA</td>
                  <td class="py-3 px-4">Onboard</td>
                </tr>
                <tr>
                  <td class="py-3 px-4">CPU</td>
                  <td class="py-3 px-4">i5-13500H</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white mt-4 p-5">
        <div class="flex justify-between mb-2">
          <h2 class="text-2xl">ĐÁNH GIÁ & NHẬN XÉT</h2>
          <div
            class="bg-red-600 text-white w-fit px-3 py-1 leading-8 rounded-md cursor-pointer"
          >
            <i class="bi bi-star-fill"></i> ĐÁNH GIÁ SẢN PHẨM
          </div>
        </div>
        <div class="border-b pb-4">
          <div class="flex items-center mb-2">
            <svg
              class="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <svg
              class="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <svg
              class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <p
              class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              4.95
            </p>
            <p
              class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              out of
            </p>
            <p
              class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              5
            </p>
          </div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            1,745 lượt đánh giá
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const cart = useCart();

const show_more = ref(false);
const maxheight = ref("800px");
function height() {
  return `max-height: ${maxheight.value}`;
}

onMounted(() => {
  if (document) {
    let content2 = document.getElementById("content-2");

    if (content2) {
      maxheight.value = `${content2.offsetHeight - 76}px`;
    }
  }
});

interface Product {
  id: Number;
  slug: string;
  name: string;
  short_description: Text;
  description: Text;
  price: Number;
  discount: Number;
  images: {
    image_url: string;
  }[];
}

const { data: product } = await eFetch<{
  status: Number;
  data: Product;
}>("/api/product/info", {
  method: "POST",
  body: {
    slug: route.params.slug,
  },
});

if (product.value?.status != 200) {
  throw showError({
    statusCode: 404,
    statusMessage: "Sản phẩm không tồn tại",
  });
}
</script>

<style scoped>
.content p {
  margin: 10px 0px;
}
</style>
