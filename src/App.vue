<template>
  <div id="app">
    <Login v-if="!authenticated" v-on:authenticated="setAuthenticated" />
    <b-container v-else>
      <NavBar :logged_user="logged_user_username" />
      <b-row class="main-area">
        <b-col cols="3" class="users">
          <Users :users="users" v-on:chat="chat" />
          <Topic /><div class="test-button"><p>Finished chatting?</p>
              <button
      type="button"
      class="btn"
      @click="showModal"
    >
      Test yourself
    </button>
    </div>
    <modal
      v-show="isModalVisible"
      @close="closeModal"
    />
        </b-col>
        <b-col cols="9" class="messages-area">
          <div class="messages-main">
            <div 
              v-if="!current_chat_channel"
              class="select-chat text-center"
            >
              Select a user to start chatting, and click "generate topic" to select your conversation topic!
            </div>

            <Messages 
              v-else 
              :active_chat="active_chat_id" 
              :messages="messages[current_chat_channel]"
            />
          </div>
          <MessageInput v-on:send_message="send_message" />
        </b-col>
      </b-row>
    </b-container>
  </div>

</template>

<script>
import MessageInput from "./components/MessageInput.vue";
import Messages from "./components/Messages.vue";
import NavBar from "./components/NavBar.vue";
import Login from "./components/Login.vue";
import Users from "./components/Users.vue";
import Topic from "./components/Topic.vue";
import modal from "./components/modal.vue";
import Pusher from "pusher-js";

// Pusher variable declared
let pusher;

export default {
  name: "app",
  components: {
    MessageInput,
    NavBar,
    Messages,
    Users,
    Login,
    Topic,
    modal,
  },
      data: function() {
        return {
          authenticated: false,
          messages: {},
          users: [],
          active_chat_id: null,
          active_chat_index: null,
          logged_user_id: null,
          logged_user_username: null,
          current_chat_channel: null,

          isModalVisible: false,
      };

      },
      methods: {
        async setAuthenticated(login_status, user_data) {

          // Update the states
          this.logged_user_id = user_data.id;
          this.logged_user_username = user_data.username;
          this.authenticated = login_status;
          this.token = user_data.token;

          // Initialize Pusher JavaScript library
          pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
              cluster: process.env.VUE_APP_PUSHER_CLUSTER,
              authEndpoint: "/api/pusher/auth",
              auth: {
                headers: {
                  Authorization: "Bearer " + this.token
                }
              }
          });

          // Retrieve users from  server
          const users = await this.axios.get("/api/users", {
            headers: { Authorization: "Bearer " + this.token }
          });

          // Get every user other than currently logged
          this.users = users.data.filter(
            user => user.userName != user_data.username
          );
          var notifications = pusher.subscribe(
            `private-notification_user_${this.logged_user_id}`
          );

          notifications.bind("new_chat", data => {
            const isSubscribed = pusher.channel(data.channel_name);
            if (!isSubscribed) {
              const one_on_one_chat = pusher.subscribe(data.channel_name);

              this.$set(this.messages, data.channel_name, []);

              one_on_one_chat.bind("new_message", data => {
                // Check current chat channel
                if (
                  data.channel !== this.current_chat_channel &&
                  data.from_user !== this.logged_user_id
                ) {
                  // Get user index
                  const index = this.users.findIndex(
                    user => user.id == data.from_user
                  );

                  this.$set(this.users, index, {
                    ...this.users[index],
                    has_new_message: true
                  });
                }

                this.messages[data.channel].push({
                  message: data.message,
                  from_user: data.from_user,
                  to_user: data.to_user,
                  channel: data.channel
                });
              });
            }
          });

                var presenceChannel = pusher.subscribe("presence-chitchat");

                presenceChannel.bind("pusher:member_added", data => {
                  // Get index of subscribed user
                  const index = this.users.findIndex(user => user.id == data.id);

                 //set is_online to true
                  this.$set(this.users, index, { ...this.users[index], is_online: true });
                });

                presenceChannel.bind("pusher:member_removed", data => {

                  const index = this.users.findIndex(user => user.id == data.id);

                  // Set  is_online to false
                  this.$set(this.users, index, {
                    ...this.users[index],
                    is_online: false
                  });
                });

                presenceChannel.bind("pusher:subscription_succeeded", data => {
                  // Set members already on channel to online
                  for (let member_id of Object.keys(data.members)) {
                    const index = this.users.findIndex(user => user.id == member_id);
                    this.$set(this.users, index, {
                      ...this.users[index],
                      is_online: true
                    });
                  }
                });

        },
        getMessage: function(channel_name) {
          this.axios
            .get(`/api/get_message/${channel_name}`, {
              headers: { Authorization: "Bearer " + this.token }
            })
            .then(response => {
              this.$set(this.messages, channel_name, response.data);
            });
        },
        chat: function(id) {
          this.active_chat_id = id;

          // Get index of  current chatting user
          this.active_chat_index = this.users.findIndex(
            user => user.id == this.active_chat_id
          );

          // Set  has_new_message to true
          this.$set(this.users, this.active_chat_index, {
            ...this.users[this.active_chat_index],
            has_new_message: false
          });

          this.axios
            .post(
              "/api/request_chat",
              {
                from_user: this.logged_user_id,
                to_user: this.active_chat_id
              },
              { headers: { Authorization: "Bearer " + this.token } }
            )
            .then(response => {
              this.users[this.active_chat_index]["channel_name"] =
                response.data.channel_name;

              this.current_chat_channel = response.data.channel_name;

              // Get messages on this channel
              this.getMessage(response.data.channel_name);

              var isSubscribed = pusher.channel(response.data.channel_name);

              if (!isSubscribed) {
                var channel = pusher.subscribe(response.data.channel_name);

                this.$set(this.messages, response.data.channel_name, []);

                channel.bind("new_message", data => {

                  if (
                    data.channel !== this.current_chat_channel &&
                    data.from_user !== this.logged_user_id
                  ) {

                    this.$set(this.users, this.active_chat_index, {
                      ...this.users[this.active_chat_index],
                      has_new_message: true
                    });
                  }

                  this.messages[response.data.channel_name].push({
                    message: data.message,
                    from_user: data.from_user,
                    to_user: data.to_user,
                    channel: data.channel
                  });
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        },

        send_message: function(message) {
          this.axios.post(
            "/api/send_message",
            {
              from_user: this.logged_user_id,
              to_user: this.active_chat_id,
              message: message,
              channel: this.current_chat_channel
            },
            { headers: { Authorization: "Bearer " + this.token } }
          );
        },

        showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      }

        },

    };
</script>

<style>
.messages-main {
  overflow-y: scroll;
  height: 90%;
}
.users {
  padding: 10px !important;
  border: 1px solid gray;
}
.no-margin {
  margin: 0px;
}
.messages-area {
  border: 1px solid gray;
  padding-top: 20px;
  max-height: calc(100vh - 4em) !important;
}
.input-message {
  height: 40px;
}
.active {
  background: #177199 !important;
  border: #17a2b8 !important;
}
.select-chat {
  margin-top: 35vh;
  padding: 8px;
}
.main-area {
  margin: 0px;
  min-height: calc(100vh - 5em) !important;
}
.logged_user {
  color: white;
}

.test-button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.btn {
  background: #0390fc;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
