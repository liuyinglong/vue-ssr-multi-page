<template>
	<button v-on:click="click"><slot></slot></button>
</template>

<script>
    export default {
        methods:{
            click(){
                this.$emit("click")
			}
		}
	}
</script>