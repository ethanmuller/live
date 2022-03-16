<template>
<div>
  <Party>
  </Party>
</div>
</template>

<script>
export default {
  head() {
    return {
      title: `Party Code: ${this.$route.params.party.toUpperCase()}`
    }
  },
}
</script>

