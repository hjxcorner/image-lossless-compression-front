<template>
  <div class="PersonalCenter">
    <template v-if="userData">
      <ImageBox :recordList="recordListMap" />
      <FeedbackBox :recordList="feedRecordListMap" />
    </template>
    <template v-else>
      <div class="invisible">
        <i class="iconfont icon-invisible"></i>
        <span>请点击头像登录</span>
      </div>
    </template>
  </div>
</template>

<script>
import ImageBox from "@/components/ImageBox";
import FeedbackBox from "@/components/FeedbackBox";
import { mapGetters } from "vuex";

export default {
  components: {
    ImageBox,
    FeedbackBox
  },
  data() {
    return {
      recordList: [],
      feedRecordList: []
    };
  },
  computed: {
    ...mapGetters(["userData"]),
    recordListMap() {
      const arr = this.recordList
        .map(item => {
          const date = new Date(item.timestamp);
          item["date"] = this.transDate(date);
          return item;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
      const dateList = this.unique(arr.map(item => item.date));
      const ret = dateList.map(date => {
        const obj = {};
        obj["time"] = date;
        obj["list"] = [];
        arr.forEach(item => {
          if (item.date === date) obj.list.push(item);
        });
        return obj;
      });
      return ret;
    },
    feedRecordListMap() {
      return this.feedRecordList
        .map(item => {
          const date = new Date(item.timestamp);
          item["date"] = this.transDate(date);
          return item;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    }
  },
  mounted() {
    console.log(this.userData);
    if (this.userData) {
      this.getRecord();
      this.getFeedback();
    }
  },
  methods: {
    getRecord() {
      this.$http
        .get(`/images/record?userid=${this.userData._id}`)
        .then(data => {
          console.log(data);
          this.recordList = data.data;
        })
        .catch(err => console.log(err));
    },
    getFeedback() {
      this.$http
        .get(`/opinion/record?userid=${this.userData._id}`)
        .then(data => {
          console.log(data);
          this.feedRecordList = data.data;
        })
        .catch(err => console.log(err));
    },
    unique(arr) {
      return [...new Set(arr)];
    },
    transDate(date) {
      const yy = date.getFullYear();
      const mm = date.getMonth() + 1;
      const dd = date.getDate();
      return `${yy}-${mm}-${dd}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.PersonalCenter {
  display: flex;
  justify-content: space-between;
  .invisible {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 200px auto;
    .iconfont {
      font-size: 100px;
      color: #909399;
    }
    span {
      color: #909399;
    }
  }
  .ImageBox {
    width: 68vw;
    display: inline-block;
  }
  .FeedbackBox {
    width: 27vw;
    display: inline-block;
  }
}
</style>