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
          <div class="progressbar">
            <el-progress
              v-if="image.curSize"
              :text-inside="true"
              :percentage="100"
              :format="format2"
              :stroke-width="18"
              class="progressbar"
              status="success"
            ></el-progress>
            <el-progress
              v-else
              :text-inside="true"
              :percentage="100"
              :format="format"
              :stroke-width="18"
              class="progressbar"
            ></el-progress>
          </div>
          <span>{{transSize(image.curSize)}}</span>
        </div>
        <div class="right">
          <!-- <span
            class="downLoad"
            @click="comparedImg(image.name,image.newName)"
          >对比</span> -->
          <span
            class="compressionRatio"
            v-show="image.curSize"
          >{{compressionRatio(image.size, image.curSize)}}</span>
          <a
            :href="image.content"
            download
            target="view_window"
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
      images: {
        // $0: {
        //   curSize: 123456,
        //   name: "前端-黄金鑫-18397857501（校招）.png",
        //   size: 390171,
        //   userId: "6077e4cfe6e7dd4ec83e3993",
        //   content:
        //     "http://img01.yohoboys.com/contentimg/2018/11/22/13/0187be5a52edcdc999f749b9e24c7815fb.jpg"
        // },
        // $1: {
        //   curSize: "",
        //   name: "前端-黄金鑫-18397857501（校招）.png",
        //   size: 390171,
        //   userId: "6077e4cfe6e7dd4ec83e3993",
        //   content:
        //     "http://img01.yohoboys.com/contentimg/2018/11/22/13/0187be5a52edcdc999f749b9e24c7815fb.jpg"
        // },
        // $2: {
        //   curSize: "",
        //   name: "前端-黄金鑫-18397857501（校招）.png",
        //   size: 390171,
        //   userId: "6077e4cfe6e7dd4ec83e3993",
        //   content:
        //     "http://img01.yohoboys.com/contentimg/2018/11/22/13/0187be5a52edcdc999f749b9e24c7815fb.jpg"
        // },
        // $3: {
        //   curSize: "",
        //   name: "前端-黄金鑫-18397857501（校招）.png",
        //   size: 390171,
        //   userId: "6077e4cfe6e7dd4ec83e3993",
        //   content:
        //     "http://img01.yohoboys.com/contentimg/2018/11/22/13/0187be5a52edcdc999f749b9e24c7815fb.jpg"
        // },
        // $4: {
        //   curSize: "",
        //   name: "前端-黄金鑫-18397857501（校招）.png",
        //   size: 390171,
        //   userId: "6077e4cfe6e7dd4ec83e3993",
        //   content:
        //     "http://img01.yohoboys.com/contentimg/2018/11/22/13/0187be5a52edcdc999f749b9e24c7815fb.jpg"
        // }
      },
      imgNumberLimit: config.imgNumberLimit,
      maxSize: config.maxSize,
      imgBaseUrl: "http://localhost:3000/public/images",
      zipBaseUrl: "http://localhost:3000/public/zip",
      zipFileName: ""
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
    },
    isLogin() {
      return this.userData;
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
        const filterFile = this.fileFilter(files);
        this.initImages(filterFile.length);
        this.render(filterFile);
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
        reader.onload = () => {
          const data = {
            name: file.name,
            content: reader.result,
            size: file.size,
            curSize: file.size,
            userId: this.isLogin ? this.userData._id : "666"
          };
          this.images["$" + index].size = file.size;
          this.images["$" + index].content = reader.result;
          this.images["$" + index].name = file.name;
          this.$http
            .post("/images/saveImage", data)
            .then(ret => {
              data.curSize = ret.data.data.size;
              data["newName"] = ret.data.data.imgName;
              data.content = `${this.imgBaseUrl}/${ret.data.data.imgName}`;
              this.images["$" + index] = data;
            })
            .catch(err => this.$message.error(err));
        };
      });
    },
    UploadFile() {
      const uploadInput = this.$refs.uploadInput;
      const files = this.fileFilter([...uploadInput.files]);
      this.initImages(files.length);
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
    },
    transSize(size) {
      if (size)
        return size > 1048576
          ? (size / (1024 * 1024)).toFixed(1) + "MB"
          : (size / 1024).toFixed(1) + "KB";
      else return "";
    },
    compressionRatio(oldSize, newSize) {
      return newSize
        ? -(((oldSize - newSize) / oldSize) * 100).toFixed(1) + "%"
        : "";
    },
    async downloadall() {
      let fileName = this.zipFileName;
      if (fileName) {
        this.createTab(fileName);
        return;
      }
      const list = [];
      for (const key in this.images) {
        list.push(this.images[key].newName);
      }
      const data = {
        list
      };
      const ret = await this.$http.post("/images/downloadall", data);
      fileName = ret.data.data.fileName;
      this.zipFileName = fileName;
      this.createTab(fileName);
    },
    createTab(fileName) {
      const a = document.createElement("a");
      a.href = this.zipBaseUrl + "/" + fileName;
      a.download = fileName;
      a.click();
    },
    format() {
      return "正在压缩";
    },
    format2() {
      return "压缩完成";
    },
    comparedImg(oldName, newName) {
      console.log(oldName, newName);
    },
    initImages(leng) {
      const obj = {};
      for (let i = 0; i < leng; i++) {
        obj["$" + i] = {
          name: "",
          content: "",
          size: "",
          curSize: "",
          userId: ""
        };
      }
      this.images = obj;
    }
  }
};
</script>

<style lang='scss' scoped>
.UploadImage {
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
      /* eslint-disable */
      .center {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 50%;
        span {
          margin: 0 5px;
          display: inline-block;
          width: 80px;
          font-size: 14px;
        }
        .progressbar {
          width: 100%;
          &::v-deep .el-progress {
            text-align: left;
            width: 100%;
            .el-progress-bar {
              width: 100% !important;
              .el-progress-bar__inner {
                text-align: center !important;
                .el-progress-bar__innerText {
                }
              }
            }
          }
        }
      }
      /* eslint-enable */
      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex: 1;
        .compressionRatio {
          font-size: 14px;
          color: #7eb631;
          margin-right: 20px;
        }
        .downLoad {
          cursor: pointer;
          font-size: 14px;
          margin-right: 30px;
          &:hover {
            color: #409eff;
          }
        }
        a {
          text-decoration: none;
          color: #303133;
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
