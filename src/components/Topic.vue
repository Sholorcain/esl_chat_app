<template>
  <div id="topic">
    <button @click="picker">generate topic</button>

    <p>{{chosenName}}</p>

  </div>
</template>

<script>
  export default {

    name: "#topic",
    data() {
      return {
    list: ['Chat about family!','Chat about hobbies!','Chat about music!','Chat about TV!',
      'Chat about Food!','Chat about holidays!','Chat about work!'],
    chosenName: ''
    };
    },
    methods: {
    picker: function(){
      const chosenNumber = Math.floor(Math.random() * this.list.length);
      this.chosenName = this.list[chosenNumber];
    }
  }
  };
</script>

<style>

#topic {
  max-width: 250px;
  height: 250px;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fff;
  /*box-shadow: 0 1px 5px rgba(68, 68, 68, 0.5);*/
}

#topic body {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
  font-family: 'Montserrat',sans-serif;
  font-weight: 500;
  color: #000;
}

#topic button {
  border: none;
  background: #0390fc;
  color: #fff;
  text-transform: uppercase;
  font-size: 1em;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 1px 5px rgba(68, 68, 68, 0.5);
}
#topic p {
  font-size: 1.5em;
  text-align: center;
  color: #0390fc;
  padding: 15px;
}

</style>