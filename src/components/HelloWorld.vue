<template>

<pre style="width: 500px;height: 500px;background-color: #ccc;margin-left: 100px;" contenteditable="true">
    nasifnsafoasnfnsa
    nasifnisafnia afasf      asf

    asfsafsaf
</pre>
<button @click="add">增加</button>

</template>

<script setup lang='ts'>
import { reactive } from 'vue';

const lists = reactive([
    {id:1,name:'张三'},
    {id:2,name:'李四'},
    {id:3,name:'王五'},
])

const add = () => {
    lists.unshift({id:0,name:'张er'})
    console.log(lists);
    
}

</script>

<style scoped>

</style>
