<script>
import PlayerList from "../components/PlayerList.vue";
import * as Colyseus from "colyseus.js";
import Vue from "vue";

let client = null;
let room = null;

export default {
  name: "BusyButton",
  components: { PlayerList },

  data() {
    return {
      url: import.meta.env.VITE_COLYSEUS_SERVER_ADDRESS,
      clients: {},
      name: "",
      joinRoomId: "",
      sessionId: "",
      gameIsRunning: false,
      countDownInterval: null,
      countDown: 3,
      joinExistingParty: false,
      gameOver: false,
      room: {
        id: "",
        adminId: "",
      },
    };
  },

  computed: {
    isAdmin() {
      return this.sessionId && this.room.adminId === this.sessionId;
    },
  },

  methods: {
    resetState() {
      this.clients = {};
      this.joinRoomId = "";
      this.sessionId = "";
      this.gameIsRunning = false;
      this.countDownInterval = null;
      (this.countDown = 3), (this.joinExistingParty = false);
      this.gameOver = false;
      this.room = {
        id: "",
        adminId: "",
      };
    },

    countButton() {
      room.send("count");
    },
    pushupStart() {
      this.gameIsRunning = true;

      this.countDownInterval = setInterval(() => {
        if (--this.countDown === 0) {
          this.$buefy.toast.open({ message: "Start!", position: "is-bottom" });
          clearInterval(this.countDownInterval);
        }
      }, 1000);
    },

    initiateGame() {
      room.send("pushup_start");
    },

    leaveRoom() {
      room.leave();
      room = null;
      this.resetState();
    },

    pushUpEnd() {
      this.$buefy.toast.open({
        message: "Spiel vorbei",
        position: "is-bottom",
      });
      this.gameIsRunning = false;
      this.gameOver = true;
    },

    async joinRoom() {
      console.log("joining the game room");

      try {
        room;

        if (this.joinExistingParty) {
          room = await client.joinById(this.joinRoomId, {
            name: this.name,
          });
        } else {
          room = await client.create("pushup_room", {
            name: this.name,
          });
        }

        this.room.id = room.id;

        room.onStateChange((changes) => {
          if (changes.adminId) this.room.adminId = changes.adminId;
        });

        this.sessionId = room.sessionId;

        room.onMessage("game_stop", this.pushUpEnd);
        room.onMessage("pushup_start", this.pushupStart);

        room.state.players.onAdd = (player, sessionId) => {
          console.log("on Add", player.name, player.score, sessionId);

          Vue.set(this.clients, sessionId, {
            name: player.name,
            score: player.score,
          });

          player.onChange = (changes) => {
            Vue.set(this.clients, sessionId, {
              name: player.name,
              score: player.score,
            });
          };
        };

        room.state.players.on;
      } catch (e) {
        console.log(e);
      }
    },
  },

  async mounted() {
    client = new Colyseus.Client(import.meta.env.VITE_COLYSEUS_SERVER_ADDRESS);
  },
};
</script>

<template>
  <div class="hero">
    <div class="hero-body">
      <b-modal
        :active="gameIsRunning"
        :can-cancel="false"
        full-screen
        class="has-background-primary"
      >
        <div class="modal-card" style="width: auto" @click="countButton">
          <header
            class="modal-card-head has-text-centered has-background-primary"
          >
            <p
              class="modal-card-title"
              :class="countDown === 0 ? 'has-text-white' : 'has-text-primary'"
            >
              LOST JETZT!
            </p>
          </header>
          <section
            class="modal-card-body has-background-primary is-flex is-justify-content-center is-align-items-center"
          >
            <div class="title is-1 has-text-white">
              <span v-if="countDown > 0"> {{ countDown }}</span>
              <span v-else>{{ clients[sessionId].score }}</span>
            </div>
          </section>
        </div>
      </b-modal>
      <div class="title is-1 has-text-white">Liegestützen</div>
      <div v-if="sessionId">
        <div v-if="gameOver">
          <div class="title is-1 has-text-white">Spiel vorbei!</div>
          <div class="title is-2 has-text-white">
            {{ Object.values(clients)[0].name }} hat gewonnen!
          </div>
          <b-field>
            <b-button size="large" type="is-primary" expanded @click="leaveRoom"
              >Spiel verlassen</b-button
            >
          </b-field>
        </div>
        <div v-else>
          <b-field v-if="isAdmin">
            <b-button
              size="large"
              type="is-primary"
              expanded
              @click="initiateGame"
              >Start</b-button
            >
          </b-field>
        </div>
        <player-list :clients="clients"></player-list>
      </div>
      <div v-else>
        <form @submit.prevent="joinRoom()">
          <b-field>
            <b-switch v-model="joinExistingParty">
              Einer bestehenden Party beitreten
            </b-switch>
          </b-field>

          <b-field label="Spiel Id" v-if="joinExistingParty">
            <b-input
              v-model="joinRoomId"
              placeholder="Möchtest du einem Raum joinen?"
              expanded
            ></b-input>
          </b-field>
          <b-field label="Name">
            <b-input
              v-model="name"
              placeholder="Dein Name"
              expanded
              required
              minlength="4"
            ></b-input>
            <p class="control">
              <b-button
                type="is-primary"
                :disabled="name.length < 4"
                native-type="submit"
                >Start</b-button
              >
            </p>
          </b-field>
        </form>
      </div>
    </div>
    <div class="hero-foot px-5">
      roomId: {{ room.id }}, sessionId: {{ sessionId }}
    </div>
  </div>
</template>
<style>
.label {
  color: white;
}

.modal-card-head {
  border-radius: 0;
}
</style>
