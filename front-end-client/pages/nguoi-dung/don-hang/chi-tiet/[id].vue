<template>
  <div>
    <div class="bg-white rounded-sm p-5">
      <h3 class="text-2xl">Chi tiết đơn hàng #{{ route.params.id }}</h3>

      <div
        class="grid grid-cols-12 border-t pt-4 mt-4"
        v-for="order in orderDetails?.data.OrderDetails"
      >
        <div class="col-span-8 flex gap-3">
          <img
            src="https://product.hstatic.net/200000722513/product/hn074w-final_d1f17cfe60c0443e9bb78a02fa874a21_large_50e5daebd00147d7959f5decd617b193_grande.png"
            alt=""
            srcset=""
            class="h-[95px] w-[95px] border object-cover"
          />
          <div>
            <div class="line-clamp-2">
              {{ order.product.name }}
            </div>
            <div class="text-red-600">
              {{
                order.product.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </div>
            <div class="text-sm text-zinc-500">
              Số lượng: {{ order.quantity }}
            </div>
          </div>
        </div>
        <div class="col-span-4 flex flex-col items-end justify-between"></div>
      </div>

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between text-lg">
          <div>Tổng tiền</div>
          <div class="text-xl text-red-500">
            {{
              (orderDetails?.data.total_price ?? 0).toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const [{ data: orderDetails, refresh }] = await Promise.all([
  eFetch<{
    status: number;
    data: {
      id: number;
      address: {
        address: string;
      };
      OrderDetails: {
        product: {
          name: string;
          price: number;
        };
        quantity: number;
      }[];
      total_price: string;
      created_at: Date;
    };
  }>("/api/user/orders/info", {
    method: "GET",
    params: { id: route.params.id },
  }),
]);
</script>

<style scoped></style>
