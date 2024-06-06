<template>
  <div>
    <div class="container mx-auto mt-5">
      <div class="text-base">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }" class="text-base"
            >Trang hủ</el-breadcrumb-item
          >
          <el-breadcrumb-item class="text-base">{{
            productList?.category.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="container mx-auto mt-5">
      <div class="bg-white rounded-md py-4 shadow-sm">
        <div class="grid grid-cols-10 gap-4 px-4 rounded-sm">
          <div v-if="!productList?.data.length" class="col-span-12">
            Chưa có sản phẩm nào
          </div>
          <NuxtLink
            :to="`/san-pham/${product.slug}`"
            class="col-span-2 flex items-center flex-col border cursor-pointer"
            v-for="product in productList?.data"
          >
            <img
              :src="product.images[0]?.image_url"
              alt=""
              class="w-full aspect-[10/10] object-contain"
            />
            <div class="p-2">
              <div class="text-start text-md font-semibold line-clamp-2 mb-2">
                {{ product.name }}
              </div>
              <div v-if="product.discount" class="text-sm text-gray-600">
                <span class="line-through me-3">
                  {{
                    (product.discount ?? 0).toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })
                  }}
                </span>
                <span
                  v-if="product.discount"
                  class="text-red-600 text-sm px-[4px] py-[1px] bg-red-100 border border-red-500 rounded-sm"
                  >-5%</span
                >
              </div>
              <div class="text-lg font-semibold text-red-600">
                {{
                  (product.price ?? 0).toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </div>
              <div class="flex gap-3 mt-2">
                <div class="text-sm text-amber-600 font-semibold">
                  {{ product.avgRating }}
                  <i class="text-xs bi bi-star-fill"></i>
                </div>
                <div class="text-sm text-gray-700">
                  ({{ product.totalReviews }} đánh giá)
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: Number;
  slug: String;
  name: String;
  price: Number;
  discount: Number;
  images: {
    image_url: string;
  }[];
  avgRating: String;
  totalReviews: String;
}

const route = useRoute();

const { data: productList } = await eFetch<{
  status: Number;
  data: Product[];
  category: {
    name: String;
  };
}>("/api/category/productList", {
  method: "POST",
  body: {
    slug: route.params.slug,
  },
  watch: false,
});
</script>

<style scoped></style>
