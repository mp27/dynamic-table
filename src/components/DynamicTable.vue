<template>
    <div class="table-container">
        <div class="table-body" ref="tableBody">
            <div class="table-row header">
                <div class="wrapper" v-for="(column, ind) in columns" :key="ind" :ref="column.key">
                    <div class="text">{{column.name}}</div>
                </div>
            </div>
            <div class="table-row"
                 ref="row"
                 v-for="(row, i) in buffer"
                 :key="row[uniqueKey] + i"
                 :class="{'odd': (i+1) % 2 != 0}"
                 @click="rowSelected(row)"
            >
                <div class="wrapper" v-for="(column, ind) in columns" :key="ind">
                    <template v-if="!column.type || column.type == columnTypes.string">
                        <div class="text">
                            {{row[column.key]}}
                        </div>
                    </template>
                    <template v-else-if="column.type == columnTypes.image">
                        <div class="text">
                            <img :src="row[column.key]">
                        </div>
                    </template>
                    <template v-else-if="column.type == columnTypes.html">
                        <div class="text" v-html="row[column.key]">
                        </div>
                    </template>
                    <template v-else-if="column.type == columnTypes.actions">
                        <div class="text">
                            <div class="actions">
                                <template v-for="action in column.actions">
                                    <button v-if="action.visible"
                                            :class="action.classes"
                                            :style="action.style"
                                            @click.stop="actionClicked(action, row)"
                                    >
                                        {{action.label}}
                                    </button>
                                </template>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text">
                            {{row[column.key]}}
                        </div>
                    </template>
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
                defaultRowHeight: 50,
                tableBodyHeight: 0,
                buffer: [],
                offset: 0,
                nextOffset: 0,
                scrollingTop: false,
                firstTimeScrollTop: true,
                columnTypes: {
                    string: 'string',
                    image: 'image',
                    html: 'html',
                    actions: 'actions'
                }
            }
        },
        mounted() {
            this.setTableBodyHeight();
            this.$refs.tableBody.addEventListener("scroll", this.onBodyScroll);
            window.addEventListener("resize", this.setTableBodyHeight);

            this.loadData({
                offset: this.offset,
                limit: this.maxRows
            });
        },
        computed: {
            rowHeight() {
                return this.$refs.row ? this.$refs.row[0].outerHeight : this.defaultRowHeight;
            },
            perPage() {
                return this.rowHeight ? Math.floor(this.tableBodyHeight / this.rowHeight) : 0;
            },
            maxRows() {
                return this.perPage ? this.perPage * 3 : 0;
            },
            pageHeight() {
                return this.perPage * this.rowHeight;
            }
        },
        methods: {
            onBodyScroll() {
                const currentScroll = this.$refs.tableBody.scrollTop;
                let height = this.$refs.tableBody.clientHeight;
                let scrollHeight = this.$refs.tableBody.scrollHeight - height;
                let percent = Math.floor(currentScroll / scrollHeight * 100);

                if (this.oldScroll < currentScroll) {
                    if (percent >= 80) {
                        if (this.scrollingTop) {
                            this.nextOffset += this.nextOffset + this.perPage * 3;
                        }
                        this.scrollingTop = false;
                        this.firstTimeScrollTop = true;
                        this.nextOffset = (this.nextOffset == 0) ? this.nextOffset + this.perPage : this.nextOffset;

                        this.offset = this.nextOffset;
                    }
                } else if (this.oldScroll > currentScroll) {
                    if (percent <= 20) {
                        this.scrollingTop = true;
                        let nextScrollOffset = this.offset;
                        if (this.firstTimeScrollTop) {
                            nextScrollOffset = this.offset - this.perPage * 3;
                        } else {
                            nextScrollOffset -= this.perPage;
                        }
                        this.firstTimeScrollTop = false;
                        this.nextOffset = 0;
                        this.offset = nextScrollOffset > 0 ? nextScrollOffset : this.nextOffset;

                    }
                }

                this.oldScroll = Math.floor(currentScroll);
                this.$forceUpdate();
            },
            loadData(meta = null) {
                if (!meta) {
                    meta = {
                        offset: this.offset,
                        limit: this.perPage
                    }
                }

                if (!this.scrollingTop && this.nextOffset < this.total || this.total == 0) {
                    this.nextOffset += meta.limit;
                }

                if (meta.offset == 0) {
                    this.nextOffset = this.perPage * 3;
                }
                this.$emit("loadData", meta);
            },
            setTableBodyHeight() {
                this.tableBodyHeight = this.$refs.tableBody.offsetHeight;
                this.$forceUpdate();
            },
            rowSelected(row) {
                this.$emit("rowSelected", row);
            },
            actionClicked(action, row) {
                this.$emit(action.eventName, row);
            }
        },
        beforeDestroy() {
            this.$refs.tableBody.removeEventListener("scroll", this.onBodyScroll);
            window.removeEventListener('resize', this.setTableBodyHeight);
        },
        watch: {
            data(newData) {
                if (!this.buffer.length) {
                    this.buffer.push(...newData)
                } else if (!this.scrollingTop && this.buffer.length >= this.perPage * 3) {
                    this.buffer.splice(0, this.perPage);
                    this.buffer.push(...newData);
                    this.$refs.tableBody.scrollTop = this.pageHeight / 2;
                } else if (this.scrollingTop) {
                    this.buffer.splice(this.perPage * 2, this.perPage);
                    this.buffer.unshift(...newData);
                    this.buffer.length = this.perPage * 3;
                    this.$refs.tableBody.scrollTop = this.pageHeight + 3 * this.rowHeight;
                }
            },
            offset() {
                this.loadData();
            }
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
        height: 50px;
    }

    .table-row.header {
        background-color: #eee;
        font-weight: bold;
        min-height: 60px;
        top: 0;
    }

    .table-row.odd {
        background: #fafafa;
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
        display: flex;
        align-items: center;
    }
</style>
