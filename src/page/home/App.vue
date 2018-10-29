<template>
	<div id="app">
		<div>111</div>
		<div>{{message}}</div>
		<div>{{data}}</div>
		<cf-button v-on:click="changeMessage">点击</cf-button>
	</div>
</template>

<script>
    import Button from "../../component/button.vue"

    export default {
        components: {
            CfButton: Button
        },
        data() {
            return {
                message: "今夜晚风吹",
                data: 1
            }
        },
        created() {
            this.$root.$on("changeData",  (data)=> {
                debugger;
                this.data = data
            })
            this.$root.$emit("changeData", 12)

        },
        methods: {
            changeMessage() {
                this.data++
                this.message = "改变" + this.data
            }
        }
    }
</script>