<template>
  <div class="login flex">
    <div class="login__left flex-center">
      <img
        src="/img/login-img.svg"
        alt=""
      >
    </div>
    <div class="login__right flex-center">
      <div>
        <h1 class="login__h1">
          Welcome Back
        </h1>
        <p class="login__p">
          Login to your account
        </p>

        <form @submit.prevent="onSubmit">
          <div class="login__item">
            <label>Username</label>
            <input
              v-model="username"
              v-validate="'required'"
              type="text"
              :class="{ 'is-invalid': submitted && errors.has('username') }"
              name="username"
              placeholder="Example: jane"
            >
          </div>
          <div class="login__item">
            <label for="">Password</label>
            <input
              v-model="password"
              v-validate="'required'"
              :class="{ 'is-invalid': submitted && errors.has('password') }"
              type="password"
              name="password"
              placeholder="Enter your password"
            >
          </div>
          <div class="login__extra flex">
            <div class="flex-align-center">
              <input
                id="forgot"
                v-model="remember"
                type="checkbox"
              >
              <label for="forgot">Remember me</label>
            </div>
            <a href="#">Forgot your password?</a>
          </div>
          <button
            type="submit"
            class="login__submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      remember: false,
      submitted: false,
    }
  },
  computed: {
    remembered () {
      return this.$store.getters['account/remembered']
    },
  },
  mounted () {
    this.logout()
    this.remember = Object.values(this.remembered).length
    this.username = this.remembered.username
    this.password = this.remembered.password
  },
  methods: {
    ...mapActions('account', [
      'login',
      'remembering',
      'removeRemember',
      'logout',
    ]),
    onSubmit () {
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.remember) {
            this.remembering({
              username: this.username,
              password: this.password,
            })
          } else {
            this.removeRemember()
          }
          this.login({ username: this.username, password: this.password })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>

	.login {
		background: #1a1c48;
		min-height: 100vh;

		&__left {
			flex: 2;
			img {
				height: 96%;
				width: 100%;
			}
		}

		&__right {
			flex: 1;
			color: #ffffff;
		}

		&__h1 {
			font-weight: 400;
			font-style: normal;
			font-size: 40px;
			line-height: 54px;
			margin: 6px 0;
			padding: 0;
		}
		&__p {
			font-weight: normal;
			font-size: 16px;
			line-height: 22px;
			margin: 0 0 32px;
		}

		&__item {
			margin-bottom: 15px;
			label {
				display: flex;
				font-weight: normal;
				font-size: 12px;
				line-height: 16px;
				margin-bottom: 10px;
			}

			input {
				border: 0.5px solid #b4b4b4;
				border-radius: 5px;
				height: 50px;
				width: 348px;
				padding-left: 16px;
				outline-color: #ffffff;
				font-size: 14px;
				line-height: 19px;
				color: #1a1c48;
			}
		}

		&__extra {
			font-weight: 400;
			font-size: 14px;
			line-height: 19px;
			margin-top: 2px;
			justify-content: space-between;

			a {
				color: #ffffff;
			}

			input {
				width: 16px;
				height: 16px;
				margin-right: 10px;
			}
		}

		&__submit {
			background: #456be6;
			width: 348px;
			height: 50px;
			margin-top: 51px;
			border: none;
			border-radius: 5px;
			font-weight: 700;
			font-size: 16px;
			line-height: 22px;
			color: #ffffff;
			cursor: pointer;
			outline-color: #456be6;
		}
	}
</style>
