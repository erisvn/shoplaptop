<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
import { useDropZone, useFileDialog } from "@vueuse/core";
import { ref } from "vue";

const optionCounter = ref(1);

const dropZoneRef = ref<HTMLDivElement>();
interface FileData {
  file: File;
  url: string;
}

const fileData = ref<FileData[]>([]);
const { open, onChange } = useFileDialog({ accept: "image/*" });

function encodeFileToBase64(
  file: any,
  callback: (base64Data: string) => void
): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64Data = reader.result;
    callback(base64Data as string);
  };
  reader.readAsDataURL(file);
}

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach((file) => {
    if (file.type.slice(0, 6) !== "image/") {
      // eslint-disable-next-line no-alert
      alert("Only image files are allowed");

      return;
    }

    encodeFileToBase64(file, (base64Data) => {
      fileData.value.push({
        file,
        url: base64Data,
      });
    });
  });
}

onChange((selectedFiles) => {
  if (!selectedFiles) return;

  for (const file of selectedFiles) {
    encodeFileToBase64(file, (base64Data) => {
      fileData.value.push({
        file,
        url: base64Data,
      });
    });
  }
});

const test = useDropZone(dropZoneRef, onDrop);
const toast = useToasts();

const content = ref("");

const data = reactive({
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: 0,
  discount_price: 0,
  stock_status: false,
  category_id: null,
  status: 0,
});

const { data: categoryRequest, execute: fetchCategories } = await useApi<{
  status: number;
  data: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
  }[];
}>(createUrl("/api/admin/category/list"), {
  body: {},
});

async function create() {
  const { data: response } = await useApi<{
    status: number;
    msg: string;
  }>("/api/admin/product/create", {
    method: "POST",
    body: {
      ...data,
      images: fileData.value,
    },
  });

  if (response.value?.status == 200) {
    navigateTo("/product/list");
    toast.success(response.value?.msg ?? "Lấy dữ liệu thất bại");
  } else {
    toast.error(response.value?.msg ?? "Lấy dữ liệu thất bại");
  }
}
</script>

<template>
  <div>
    <div
      class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6"
    >
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">Thêm sản phẩm</h4>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap" @click="create">
        <VBtn>Đăng Sản Phẩm</VBtn>
      </div>
    </div>

    <VRow>
      <VCol md="8">
        <!-- 👉 Product Information -->
        <VCard class="mb-6" title="Thông tin sản phẩm">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField
                  label="Tên sản phẩm"
                  placeholder="Ví dụ: iPhone 14"
                  v-model="data.name"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  label="Dường dẫn"
                  placeholder="Ví dụ: iphone-14"
                  v-model="data.slug"
                />
              </VCol>
              <VCol cols="12">
                <span class="mb-1">Mô tả ngắn (optional)</span>
                <Editor
                  v-model="data.short_description"
                  api-key="jrzn4ur2hywvu10mxf657z18kgk3w7jgl135pxzguqkwomz6"
                  :init="{
                    toolbar_mode: 'sliding',
                    plugins:
                      'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                    imagetools_cors_hosts: ['picsum.photos'],
                    menubar: 'file edit view insert format tools table help',
                    toolbar:
                      'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                    toolbar_sticky: true,
                    autosave_ask_before_unload: true,
                    autosave_interval: '30s',
                    autosave_prefix: '{path}{query}-{id}-',
                    autosave_restore_when_empty: false,
                    autosave_retention: '2m',
                    image_advtab: true,
                    link_list: [
                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                      { title: 'My page 2', value: 'http://www.moxiecode.com' },
                    ],
                    image_list: [
                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                      { title: 'My page 2', value: 'http://www.moxiecode.com' },
                    ],
                    image_class_list: [
                      { title: 'None', value: '' },
                      { title: 'Some class', value: 'class-name' },
                    ],
                    importcss_append: true,
                    template_cdate_format:
                      '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                    template_mdate_format:
                      '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                    height: 600,
                    image_caption: true,
                    quickbars_selection_toolbar:
                      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    noneditable_noneditable_class: 'mceNonEditable',
                    contextmenu: 'link image imagetools table',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }"
                  initial-value="Welcome to TinyMCE!"
                />
              </VCol>
              <VCol>
                <span class="mb-1">Mô tả sản phẩm</span>
                <Editor
                  v-model="data.description"
                  api-key="jrzn4ur2hywvu10mxf657z18kgk3w7jgl135pxzguqkwomz6"
                  :init="{
                    toolbar_mode: 'sliding',
                    plugins:
                      'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                    imagetools_cors_hosts: ['picsum.photos'],
                    menubar: 'file edit view insert format tools table help',
                    toolbar:
                      'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                    toolbar_sticky: true,
                    autosave_ask_before_unload: true,
                    autosave_interval: '30s',
                    autosave_prefix: '{path}{query}-{id}-',
                    autosave_restore_when_empty: false,
                    autosave_retention: '2m',
                    image_advtab: true,
                    link_list: [
                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                      { title: 'My page 2', value: 'http://www.moxiecode.com' },
                    ],
                    image_list: [
                      { title: 'My page 1', value: 'https://www.tiny.cloud' },
                      { title: 'My page 2', value: 'http://www.moxiecode.com' },
                    ],
                    image_class_list: [
                      { title: 'None', value: '' },
                      { title: 'Some class', value: 'class-name' },
                    ],
                    importcss_append: true,
                    template_cdate_format:
                      '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                    template_mdate_format:
                      '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                    height: 600,
                    image_caption: true,
                    quickbars_selection_toolbar:
                      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    noneditable_noneditable_class: 'mceNonEditable',
                    contextmenu: 'link image imagetools table',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }"
                  initial-value="Welcome to TinyMCE!"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- 👉 Media -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title> Ảnh sản phẩm </template>
          </VCardItem>

          <VCardText>
            <div class="flex">
              <div class="w-full h-auto relative">
                <div
                  ref="dropZoneRef"
                  class="cursor-pointer"
                  @click="() => open()"
                >
                  <div
                    v-if="fileData.length === 0"
                    class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border-dashed drop-zone"
                  >
                    <IconBtn variant="tonal" class="rounded-sm">
                      <VIcon icon="tabler-upload" />
                    </IconBtn>
                    <div
                      class="text-base text-high-emphasis font-weight-medium"
                    >
                      Drag and Drop Your Image Here.
                    </div>
                    <span class="text-disabled">or</span>

                    <VBtn variant="tonal"> Browse Images </VBtn>
                  </div>

                  <div
                    v-else
                    class="d-flex justify-center align-center gap-3 pa-8 border-dashed drop-zone flex-wrap"
                  >
                    <VRow class="match-height w-100">
                      <template v-for="(item, index) in fileData" :key="index">
                        <VCol cols="12" sm="4">
                          <VCard :ripple="false" border>
                            <VCardText class="d-flex flex-column" @click.stop>
                              <VImg
                                :src="item.url"
                                width="200px"
                                height="150px"
                                class="w-100 mx-auto"
                              />
                              <div class="mt-2">
                                <span class="clamp-text text-wrap">
                                  {{ item.file.name }}
                                </span>
                                <span> {{ item.file.size / 1000 }} KB </span>
                              </div>
                            </VCardText>
                            <VSpacer />
                            <VCardActions>
                              <VBtn
                                variant="outlined"
                                block
                                @click.stop="fileData.splice(index, 1)"
                              >
                                Remove File
                              </VBtn>
                            </VCardActions>
                          </VCard>
                        </VCol>
                      </template>
                    </VRow>
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol md="4" cols="12">
        <!-- 👉 Pricing -->
        <VCard title="Giá" class="mb-6">
          <VCardText>
            <AppTextField
              v-model="data.price"
              label="Giá sản phẩm"
              placeholder="Nhập giá bán sản phẩm"
              class="mb-6"
            />
            <AppTextField
              v-model="data.discount_price"
              label="Giá giảm giá"
              placeholder="Nhập giá giảm giá"
              class="mb-4"
            />

            <VDivider class="my-2" />

            <div class="d-flex flex-raw align-center justify-space-between">
              <span>Còn hàng</span>
              <VSwitch density="compact" v-model="data.stock_status" />
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Organize -->
        <VCard title="Organize">
          <VCardText>
            <div class="d-flex flex-column gap-y-4">
              <AppSelect
                v-model="data.category_id"
                placeholder="Select Category"
                :items="categoryRequest?.data"
                item-title="name"
                item-value="id"
                label="Danh mục"
              />
              <AppSelect
                v-model="data.status"
                :items="[
                  { label: 'Công khai', value: 0 },
                  { label: 'Không công khai', value: 1 },
                ]"
                item-title="label"
                item-value="value"
                label="Trạng thái"
              ></AppSelect>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;

      .v-selection-control__wrapper {
        margin-block-start: -0.375rem !important;
      }
    }

    .v-label.custom-input {
      border: none !important;
    }
  }

  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }
}

.ProseMirror {
  p {
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>
