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
        // component props
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
            // defaults
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
            // because we need the dom, on mounted we add event listeners
            this.setTableBodyHeight();
            this.$refs.tableBody.addEventListener("scroll", this.onBodyScroll);
            window.addEventListener("resize", this.setTableBodyHeight);

            // loading initial data
            this.loadData({
                offset: this.offset,
                limit: this.maxRows
            });
        },
        computed: {
            // row height
            rowHeight() {
                return this.$refs.row ? this.$refs.row[0].outerHeight : this.defaultRowHeight;
            },
            // how many items per page
            perPage() {
                return this.rowHeight ? Math.floor(this.tableBodyHeight / this.rowHeight) : 0;
            },
            // max number of rows
            maxRows() {
                return this.perPage ? this.perPage * 3 : 0;
            },
            //page height
            pageHeight() {
                return this.perPage * this.rowHeight;
            }
        },
        methods: {
            onBodyScroll() {
                // get the current scroll and calculate the current scroll percent
                const tableBody = this.$refs.tableBody;
                const currentScroll = tableBody.scrollTop;
                let height = tableBody.clientHeight;
                let scrollHeight = tableBody.scrollHeight - height;
                let percent = Math.floor(currentScroll / scrollHeight * 100);

                // if the oldscroll is less than current scroll it means that the user is scrolling down
                if (this.oldScroll < currentScroll) {
                    // if the users scrolled 80% we load new data
                    if (percent >= 80) {
                        // check if the users previusly scrolled top and change the offset
                        if (this.scrollingTop) {
                            this.nextOffset += this.nextOffset + this.perPage * 3;
                        }
                        // reset scrolling top vars
                        this.scrollingTop = false;
                        this.firstTimeScrollTop = true;
                        // check if nextOffset is 0 , increment it with a page
                        this.nextOffset = (this.nextOffset == 0) ? this.nextOffset + this.perPage : this.nextOffset;
                        // change the offset with nextoffset
                        this.offset = this.nextOffset;
                    }
                } else if (this.oldScroll > currentScroll) {
                    // user is scrolling top, check if he reached 20% of scroll
                    if (percent <= 20) {
                        // same kind of logic for offsettings
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

                // set oldscroll with the new scroll
                this.oldScroll = Math.floor(currentScroll);

                // because this is a function executed on window event and multiple times, we need to force the update
                this.$forceUpdate();
            },
            loadData(meta = null) {
                // if meta is null, get the meta from data
                if (!meta) {
                    meta = {
                        offset: this.offset,
                        limit: this.perPage
                    }
                }

                // if user is scrolling down, increment the next offset
                if (!this.scrollingTop && this.nextOffset < this.total || this.total == 0) {
                    this.nextOffset += meta.limit;
                }

                // if meta offset is 0 , nextoffset should be 3 pages
                if (meta.offset == 0) {
                    this.nextOffset = this.perPage * 3;
                }

                // emit the loadData event
                this.$emit("loadData", meta);
            },
            // function to set the "table body" on data
            setTableBodyHeight() {
                this.tableBodyHeight = this.$refs.tableBody.offsetHeight;
                // because we have listeners for window, even if the property is on $data, it won't update, so forceUpdate
                // is needed
                this.$forceUpdate();
            },
            // method for row select event
            rowSelected(row) {
                this.$emit("rowSelected", row);
            },
            // general method for actions column type
            actionClicked(action, row) {
                this.$emit(action.eventName, row);
            }
        },
        beforeDestroy() {
            // before destroy we need to remove the listeners
            this.$refs.tableBody.removeEventListener("scroll", this.onBodyScroll);
            window.removeEventListener('resize', this.setTableBodyHeight);
        },
        watch: {
            data(newData) {
                // if data changed, we need to add it to the buffer
                // if buffer length is 0 , we need to add newData to it
                if (!this.buffer.length) {
                    this.buffer.push(...newData)
                } else if (!this.scrollingTop && this.buffer.length >= this.perPage * 3) {
                    // if user scrolled down, we remove a page from the index 0 and push the new array
                    this.buffer.splice(0, this.perPage);
                    this.buffer.push(...newData);
                    // set the scroll back to half page
                    this.$refs.tableBody.scrollTop = this.pageHeight / 2;
                } else if (this.scrollingTop) {
                    // if user scrolled top, remove the last page
                    this.buffer.splice(this.perPage * 2, this.perPage);
                    // add new data to start
                    this.buffer.unshift(...newData);
                    // set length of data to 3 pages (removing the last page)
                    this.buffer.length = this.perPage * 3;
                    // set the scroll back
                    this.$refs.tableBody.scrollTop = this.pageHeight + 3 * this.rowHeight;
                }
            },
            offset() {
                // when offset changes , load data
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
