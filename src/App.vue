<template>
  <div id="app">
    <draggable element="ul">
      <li v-for="task in tasks" :key="task">{{ task }}</li>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  name: "App",

  components: {
    draggable
  },

  data: () => ({
    tasks: [
        "task1",
        "task2",
        "task3",
        "task4",
      ]
  }),
};
</script>
