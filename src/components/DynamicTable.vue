<template>
    <div class="table-container">
        <div class="table-row header">
            <div class="wrapper">
                <div v-for="(column, ind) in columns" class="p-2" :key="ind" :ref="column.key">
                    <div class="text">{{column.name}}</div>
                </div>
            </div>
        </div>
        <div class="table-body" ref="tableBody">
            <div class="table-row" ref="row" v-for="row in data" :key="row[uniqueKey]">
                <div class="wrapper" v-for="(column, ind) in columns" :key="ind">
                    <div class="text">
                        {{row[column.key]}}
                    </div>
                </div>
            </div>
        </div>
        <div class="table-footer d-flex">
            <div class="wrapper">
                <div class="text">
                    Total: {{total}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DynamicTable',
        props: {
            columns: {
                type: Array,
                required: true
            },
            data: {
                type: Array,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            uniqueKey: {
                type: String,
                default: () => {
                    return "id"
                }
            }
        },
        data() {
            return {
                oldScroll: 0,
                pageFetchScroll: 0,
                defaultRowHeight: 30,
                tableBodyHeight: 0
            }
        },
        computed: {
            rowHeight() {
                return this.$refs.row.length ? this.$refs.row[0].clientHeight : this.defaultRowHeight;
            },
            perPage(){
                return Math.floor(this.tableBodyHeight / this.rowHeight);
            }
        },
        mounted() {
            this.setTableBodyHeight();
            this.$refs.tableBody.addEventListener("scroll", this.onBodyScroll);
            window.addEventListener("resize", this.setTableBodyHeight);
        },
        methods: {
            onBodyScroll() {
                const currentScroll = this.$refs.tableBody.scrollTop;

                if (this.oldScroll < currentScroll) {
                    console.log("down")
                } else if (this.oldScroll > currentScroll) {
                    console.log("up")
                }

                this.oldScroll = currentScroll;
            },
            loadData() {
                this.$emit("loadData", {page: 1, page_size: 50});
            },
            setTableBodyHeight() {
                this.tableBodyHeight = this.$refs.tableBody.offsetHeight;
                this.$forceUpdate();
            }
        },
        beforeDestroy(){
            this.$refs.tableBody.removeEventListener("scroll", this.onBodyScroll);
            window.removeEventListener('resize', this.setTableBodyHeight);
        }
    }
</script>
<style scoped>
    .table-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 600px;
        overflow-x: scroll;
        display: flex;
        flex-direction: column;
    }

    .table-body {
        flex: 1;
        overflow-y: scroll;
        overflow-x: visible;
    }

    .table-row {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
        border-bottom: 1px solid #e0e0e0;
        border-collapse: collapse;
        padding-top: 5px;
    }

    .table-row.header {
        background-color: #eee;
        font-weight: bold;
        min-height: 60px;
        top: 0;
    }

    .wrapper {
        display: flex;
        flex-direction: row;
        flex-grow: 0;
    }

    .table-footer {
        background: #eee;
        min-height: 60px;
        align-items: center;
        padding: 10px;
    }

    .text {
        width: 350px;
    }
</style>
