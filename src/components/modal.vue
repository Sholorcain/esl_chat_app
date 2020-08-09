<script>
  export default {
    name: 'modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },

  };

  // This function to submit the quiz answers and calculate a score ends up crashing the app, so it's been
  //removed for now

  /* document.getElementById("form1").onsubmit=function() {
     first = parseInt(document.querySelector('input[name = "first"]:checked').value);
	   second = parseInt(document.querySelector('input[name = "second"]:checked').value);
	   third = parseInt(document.querySelector('input[name = "third"]:checked').value);
	   fourth = parseInt(document.querySelector('input[name = "fourth"]:checked').value);


	   result = first + second + third + fourth;

	document.getElementById("grade").innerHTML = result;

    return false; // required to not refresh the page; just leave this here
    }  */

</script>
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header>
          <br>
        </header>
<body>
<div id="main">

<form id="form1">

<h5>My parents ____ my best friends</h5>
<label for="var_string"><input type="radio" name="first" value="25" id="var_string" />are</label>
<label for="var_join"><input type="radio" name="first" value="0" id="var_join" />is</label>

<h5>How ______ languages can you speak?</h5>
<label for="sub_string"><input type="radio" name="second" value="25" id="sub_string"/>many</label>
<label for="sub_join"><input type="radio" name="second" value="0" id="sub_join"/>much</label>

<h5>Choose the correct sentence:</h5>
<label for="cat_string"><input type="radio" name="third" value="0" id="cat_string" />I watch a lot of TV.</label>
<label for="cat_join"><input type="radio" name="third" value="25" id="cat_join" />I watch lots TV.</label>

  <h5>I would like ____ work in Japan</h5>
<label for="cat_string"><input type="radio" name="fourth" value="0" id="cat_string" />to</label>
<label for="cat_join"><input type="radio" name="fourth" value="25" id="cat_join" />be</label>

<!-- <button type="submit" value="Submit">Submit</button> -->
  <!-- "Submit" button and grade display removed temporarily, as it was causing the app to crash -->

</form>

<!-- <p>Your grade is: <span id="grade">__</span></p>
<p id="grade2"></p> -->
</div>
</body>
        <footer class="modal-footer">
          <slot name="footer">

            <button
              type="button"
              class="btn-green"
              @click="close"
              aria-label="Close modal"
            >
              Return to chat
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: center;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }


#main {
  width: 80%;
  max-width: 950px;
  border: 1px gray solid;
  margin: auto;
  padding: 10px;
  padding-left: 40px;
  background-color: white;
  border-radius: 10px;
}


label {
  display: block;
}

input {
  width: 30px;
}

h3 {
  clear: both;
  padding-top: 20px;
}

</style>