<script lang="js">
import TheWelcome from "@/components/TheWelcome.vue";

export default {
  name: "HomeView",
  components: {TheWelcome},

  async mounted() {

  }
};
</script>

<template>
  <div class="hero">
    <div class="hero-body">
      <div class="title is-1 has-text-white">Home</div>
      <div>
        <router-link class="button is-primary" to="/pushups"
          >Liegestützen</router-link
        >
      </div>
      <div class="mt-4">
        <router-link class="button is-primary" to="/reaction-time"
          >Reaktionszeit</router-link
        >
      </div>
    </div>
  </div>
</template>
