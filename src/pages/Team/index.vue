<template>
    <div class="layout">
        <div class="leftSideNav">

        </div>
        <div class="rightPart">
            <div class="topNav">

            </div>
            <div class="main">

            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped>

.layout {
    display: flex;
}

.leftSideNav {
    width: 20%;
    height: 100vh;
    background-color: black;
}

.rightPart {
    width: 80%;
    display: flex;
    flex-direction: column;
    
}

.topNav {
    width: 100%;
    height: 100px;
    background-color: blue;
}

.main {
    width: 100%;
    height: 100%;
    background-color: green;
}

</style>