<template>
    <div id="webviewer-app">
        <GenerateInvoice path="." configPath='./webviewerConfigs/editorConfig.js' />
    </div>
</template>

<style>
html,
body {
    margin: 0;
}

#webviewer{
    height: 100vh;
    width: auto;
    text-align: center;
}
#webviewer-app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #17191e;
    margin: 0 auto;
    height: 100vh;
}
</style>