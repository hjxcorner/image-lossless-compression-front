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
                名称：
                6666666666666
              </p>
              <p>
                压缩率：
                75.4%
              </p>
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
    recordList:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgBaseUrl: "http://localhost:3000/public/images"
    };
  },
  methods: {}
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
      .imgBox {
        position: relative;
        margin: 10px;
        img {
          width: 10vw;
        }
        .detail {
          opacity: 0;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40%;
          background-color: rgba(51, 51, 51, 0.404);
          transition: all 1s;

          p {
            text-align: left;
            color: #fff;
            padding-left: 10px;
            font-size: 12px;
          }
        }
        &:hover {
          .detail {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>