<template>
    <div id="app">
        <DynamicTable />
    </div>
</template>

<script>
    import DynamicTable from './components/DynamicTable.vue'

    export default {
        name: 'app',
        components: {
            DynamicTable
        }
    }
</script>
