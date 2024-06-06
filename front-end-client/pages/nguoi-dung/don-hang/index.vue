<template>
  <div>
    <div class="bg-white rounded-sm p-5">
      <h3 class="text-2xl">Quản lý đơn hàng</h3>

      <el-table class="mt-4" :data="orderList?.data" border style="width: 100%">
        <el-table-column prop="id" label="MÃ ĐƠN" width="100">
          <template #default="scope">
            <NuxtLink :to="`/nguoi-dung/don-hang/chi-tiet/${scope.row.id}`"
              >#{{ scope.row.id }}</NuxtLink
            >
          </template>
        </el-table-column>
        <el-table-column prop="address.address" label="Địa chỉ" />

        <el-table-column prop="created_at" label="Ngày đặt">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column prop="total_price" label="Tổng giá">
          <template #default="scope">
            {{
              scope.row.total_price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })
            }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Trạng thái">
          <template #default="scope">
            {{ getStatusText(scope.row.status) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
const [{ data: orderList, refresh }] = await Promise.all([
  eFetch<{
    status: number;
    data: {
      id: number;
      address: {
        address: string;
      };
      total_price: string;
      created_at: Date;
    }[];
  }>("/api/user/orders/list", {
    method: "GET",
  }),
]);

function formatDate(dateString: Date) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getStatusText(status: number) {
  switch (status) {
    case 0:
      return "Chờ xử lý";
    case 1:
      return "Đã đóng gói";
    case 2:
      return "Đang giao hàng";
    case 3:
      return "Giao thành công";
    case 4:
      return "Giao hàng thất bại";
    default:
      return "";
  }
}
</script>

<style scoped></style>
