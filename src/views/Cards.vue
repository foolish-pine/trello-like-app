<template>
  <div style="height: 100%" :style="themeColor">
    <HeaderItem></HeaderItem>
    <CardDisplay></CardDisplay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import draggable from "vuedraggable";
import HeaderItem from "../components/HeaderItem.vue";
import CardDisplay from "../components/CardDisplay.vue";
import AppModule from "../store/modules/app";

@Component({
  components: {
    draggable,
    HeaderItem,
    CardDisplay
  }
})
export default class Cards extends Vue {
  get themeColor() {
    return `background-color: ${AppModule.themeColor} !important`;
  }
}
</script>