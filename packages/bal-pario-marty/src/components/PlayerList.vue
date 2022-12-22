<template>
  <div class="player-list">
    <div class="mt-6">
      <transition-group
        name="list-complete"
        tag="div"
        class="columns is-mobile is-multiline is-gapless"
      >
        <div
          class="column is-half list-complete-item"
          v-for="player in players"
          :key="`player-list__player-${player.id}`"
        >
          <div class="pr-3 pb-3" style="height: 100%">
            <div class="player card" style="height: 100%">
              <div class="card-header">
                <div class="card-header-title">
                  {{ player.name }}
                </div>
              </div>
              <div class="card-content">
                <div class="title" :class="isReaction ? 'is-3' : 'is-1'">
                  {{ isReaction ? `${player.score / 1000}S` : player.score }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    clients: { type: Object, required: true },
    isReaction: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    players() {
      let mappedPlayers = Object.entries(this.clients).map(([key, value]) => {
        return {
          ...value,
          id: key,
        };
      });

      return Object.values(mappedPlayers).sort((a, b) => {
        if (this.isReaction) return a.score - b.score;
        return b.score - a.score;
      });
    },
  },
};
</script>
<style>
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
  /* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
