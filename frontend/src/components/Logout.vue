<template>
    
</template>

<script>
export default {
    created() {
        this.$store.dispatch('destroyToken')
        .then(res => {
            this.$router.push({ name: 'Login' })
        }).catch(err => {
            this.$router.push({ name: 'Login' })
        })
    }
}
</script>

