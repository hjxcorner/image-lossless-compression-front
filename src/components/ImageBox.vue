<template>
  <div class="ImageBox">
    <div class="title">
      <el-divider content-position="center">历史记录</el-divider>
    </div>
    <template v-if="recordList.length">
      <div
        class="bigBox"
        v-for="(record) in recordList"
        :key="record.time"
      >
        <el-divider content-position="left">{{record.time}}</el-divider>
        <div class="recordItem">
          <div
            class="imgBox"
            v-for="(img, id) in record.list"
            :key="id"
          >
            <img
              :src="`${imgBaseUrl}/${img.imgName}`"
              alt="无法显示"
            >
            <div class="detail">
              <p>
                名称: {{img.imgName}}
              </p>
              <p>
                压缩前：{{transSize(img.oldSize)}}
              </p>
              <p>
                压缩后：{{transSize(img.newSize)}}
              </p>
              <div class="btn">
                <a
                  :href="`${imgBaseUrl}/${img.imgName}`"
                  download
                  target="view_window"
                >
                  <el-button
                    type="primary"
                    circle
                    icon="el-icon-download"
                  ></el-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  props: {
    recordList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgBaseUrl: "http://localhost:3000/public/images"
    };
  },
  methods: {
    transSize(size) {
      if (size)
        return size > 1048576
          ? (size / (1024 * 1024)).toFixed(1) + "MB"
          : (size / 1024).toFixed(1) + "KB";
      else return "";
    }
  }
};
</script>

<style lang="scss" scoped>
.ImageBox {
  .title {
    .el-divider__text {
      background-color: transparent;
      color: rgb(88, 88, 88);
      font-size: 16px;
      font-weight: bold;
    }
  }
  .bigBox {
    background-color: #fff;
    border-radius: 5px;
    .el-divider {
      background-color: #fff;
      .el-divider__text {
        font-size: 16px;
        font-weight: bold;
        color: #606266;
      }
    }
    .recordItem {
      display: flex;
      flex-wrap: wrap;
      // align-items: center;
      .imgBox {
        position: relative;
        overflow: hidden;
        margin: 10px;
        img {
          height: 15vw;
        }
        .detail {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 15vw;
          background-color: rgba(51, 51, 51, 0.404);
          transition: all 1s;
          p {
            text-align: left;
            color: #fff;
            padding-left: 10px;
            font-size: 12px;
            word-break: break-all;
            margin: 10px 0;
            padding: 0 10px;
            // white-space: nowrap;
            // text-overflow: ellipsis;
          }
          .btn {
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
          }
        }
        &:hover {
          .detail {
            // opacity: 1;
            left: 0;
          }
        }
      }
    }
  }
}
</style>