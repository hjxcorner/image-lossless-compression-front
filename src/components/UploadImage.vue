<template>
  <div
    class="UploadImage"
    ref='select_frame'
    ondragstart="return false"
  >
    <div class="uploadText">
      <i class="iconfont icon-load"></i>
      <span>将jpg格式或png格式的图片拖动到这里</span>
      <span>最多可添加{{imgNumberLimit}}张图片，且图片不得大于{{maxSizeMb}}MB</span>
      <input
        class="uploadInput"
        type="file"
        accept=".png, .jpg, .jpeg"
        ref='uploadInput'
        @change="UploadFile"
        multiple
      />
    </div>
    <div
      class="scheduleBox"
      v-if="images.length"
    >
      <div
        class="scheduleItem"
        v-for="image in images"
        :key="image.name"
      >
        <div class="left">
          <img
            :src="image.content"
            alt="image.name"
          >
          <span>{{image.name}}</span>
        </div>
        <div class="center">
          <span>{{image.size}}</span>
          <div style="width:100%;">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="100"
            ></el-progress>
          </div>
        </div>
        <div class="right">
          <span class="downLoad">下载</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import config from "../../public/config";

export default {
  data() {
    return {
      images: [],
      imgNumberLimit: config.imgNumberLimit,
      maxSize: config.maxSize
    };
  },
  computed: {
    maxSizeMb() {
      return this.maxSize / (1024 * 1024);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.select_frame.ondragleave = e => {
        e.preventDefault(); // 阻止离开时的浏览器默认行为
      };
      this.$refs.select_frame.ondrop = e => {
        e.preventDefault();
        const files = [...e.dataTransfer.files];
        const images = this.fileFilter(files);
        this.render(images);
      };
      this.$refs.select_frame.ondragenter = e => {
        e.preventDefault();
      };
      this.$refs.select_frame.ondragover = e => {
        e.preventDefault();
      };
    });
  },
  methods: {
    render(files) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log(file);
          const data = {
            name: file.name,
            content: reader.result,
            size:
              file.size > 1048576
                ? (file.size / (1024 * 1024)).toFixed(1) + "MB"
                : (file.size / 1024).toFixed(1) + "KB"
          };
          this.images.push(data);
          this.$http
            .post("/images/saveImage", data)
            .then(data => console.log(data))
            .catch(err => console.log(err));
        };
      });
    },
    UploadFile() {
      const uploadInput = this.$refs.uploadInput;
      const files = this.fileFilter([...uploadInput.files]);
      this.render(files);
    },
    fileFilter(files) {
      let isImage, isTooBig;
      return files.filter(item => {
        isImage = item.type.indexOf("image") > -1;
        isTooBig = item.size > this.maxSize;
        if (!isImage) {
          this.$message({
            showClose: true,
            message: `文件${item.name}不是jpg/png格式`,
            type: "error"
          });
        } else if (isTooBig) {
          this.$message({
            showClose: true,
            message: `文件${item.name}大于${this.maxSizeMb}MB`,
            type: "error"
          });
        }
        return isImage && !isTooBig;
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.UploadImage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  .uploadText {
    position: relative;
    width: 400px;
    height: 300px;
    border: 1px #333 dashed;
    border-radius: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      font-size: 100px;
    }
    span {
      font-size: 18px;
      &:nth-child(3) {
        font-size: 14px;
        color: rgb(173, 173, 173);
      }
    }
    .uploadInput {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .scheduleBox {
    margin: 20px 0;
    width: 80vw;
    padding: 12px;
    background: #fff;
    .scheduleItem {
      height: 30px;
      background: rgb(241, 241, 241);
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        height: 100%;
        img {
          height: 90%;
          margin: 4px;
        }
        span {
          font-size: 14px;
        }
      }
      .center {
        display: flex;
        align-items: center;
        width: 50%;
      }
      .right {
        display: flex;
        align-items: center;
        .downLoad {
          cursor: pointer;
          font-size: 14px;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
  &:hover {
    border-color: #78c3f3;
  }
}
</style>
