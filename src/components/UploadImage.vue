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
      v-if="Object.keys(images).length"
    >
      <div
        class="scheduleItem"
        v-for="(image, name) in images"
        :key="name"
      >
        <div class="left">
          <img
            :src="image.content"
            alt="图片名"
          >
          <span>{{image.name}}</span>
        </div>
        <div class="center">
          <span>{{transSize(image.size)}}</span>
          <div style="width:100%;">
            <el-progress
              :percentage="100"
              status="success"
            ></el-progress>
          </div>
          <span>{{transSize(image.curSize)}}</span>
        </div>
        <div class="right">
          <span class="downLoad">对比</span>
          <a
            :href="image.content"
            download
          >
            <span class="downLoad">下载</span>
          </a>
        </div>
      </div>
    </div>
    <div
      class="dowmloadAll"
      v-if="Object.keys(images).length"
    >
      <el-button
        type="primary"
        icon="el-icon-download"
        :loading="finishAll"
        @click="downloadall"
      >下载全部</el-button>
    </div>
  </div>
</template>

<script>
import config from "../../public/config";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      images: {},
      imgNumberLimit: config.imgNumberLimit,
      maxSize: config.maxSize,
      imgBaseUrl: "http://localhost:3000/public/images",
      zipBaseUrl: "http://localhost:3000/public/zip"
    };
  },
  computed: {
    ...mapGetters(["userData"]),
    maxSizeMb() {
      return this.maxSize / (1024 * 1024);
    },
    finishAll() {
      const arr = Object.keys(this.images);
      if (!arr.length) {
        return true;
      } else {
        return !arr.every(item => {
          return this.images[item].curSize !== "";
        });
      }
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
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log(file);
        reader.onload = () => {
          const data = {
            name: file.name,
            content: reader.result,
            size: file.size,
            curSize: file.size,
            userId: this.userData._id
          };
          this.$http
            .post("/images/saveImage", data)
            .then(ret => {
              data.curSize = ret.data.data.size;
              data.content = `${this.imgBaseUrl}/${ret.data.data.imgName}`;
              data.name = ret.data.data.imgName;
              this.images["$" + index] = data;
            })
            .catch(err => console.log(err));
        };
      });
    },
    UploadFile() {
      const uploadInput = this.$refs.uploadInput;
      const files = this.fileFilter([...uploadInput.files]);
      const timestampArr = files.map(() => "");
      const Obj = {};
      timestampArr.forEach((item, index) => {
        Obj["$" + index] = {
          name: "",
          content: "",
          size: "",
          curSize: "",
          userId: ""
        };
      });
      this.images = Obj;
      this.render(files, timestampArr);
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
    },
    transSize(size) {
      return size > 1048576
        ? (size / (1024 * 1024)).toFixed(1) + "MB"
        : (size / 1024).toFixed(1) + "KB";
    },
    async downloadall() {
      const list = [];
      for (const key in this.images) {
        list.push(this.images[key].name);
      }
      const data = {
        list
      };
      const ret = await this.$http.post("/images/downloadall", data);
      const fileName = ret.data.data.fileName;
      const a = document.createElement("a");
      a.href = this.zipBaseUrl + "/" + fileName;
      console.log(a.href);
      a.download = fileName;
      a.click();
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
      // justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        height: 100%;
        width: 25%;
        img {
          height: 90%;
          margin: 4px;
        }
        span {
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .center {
        display: flex;
        align-items: center;
        width: 50%;
        span {
          margin: 0 5px;
          display: inline-block;
          width: 80px;
        }
      }
      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex: 1;
        .downLoad {
          cursor: pointer;
          font-size: 14px;
          margin-right: 30px;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
  .dowmloadAll {
    padding: 20px;
    .el-button {
      padding: 8px 16px;
    }
  }
  &:hover {
    border-color: #78c3f3;
  }
}
</style>
