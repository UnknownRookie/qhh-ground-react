import React, { Component } from 'react'
import { Table, ConfigProvider, Tooltip } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './table.css'
const columns = [{
    title: '访客姓名',
    dataIndex: 'visitorName',
    width:150,
    key:'visitorName',
    ellipsis: {
        showTitle: false,
    },
    render: visitorName => (
        <Tooltip placement="topLeft" title={visitorName}>
            {visitorName}
        </Tooltip>
    ),
},
{
    title: '性别',
    dataIndex: 'visitorSex',
    key:'visitorSex',
    width:100,
    render:(val)=>{
        return val === 1?'男':'女'
    }
},
{
    title: '被访人姓名',
    dataIndex: 'beVisitPersonName',
    key:'beVisitPersonName',
    width:150,
},
{
    title: '访客卡号',
    dataIndex: 'cardNum',
    key:'cardNum',
    ellipsis: {
        showTitle: false,
    },
    render: cardNum => (
        <Tooltip placement="topLeft" title={cardNum}>
            {cardNum}
        </Tooltip>
    ),
},
{
    title: '设备名称',
    dataIndex: 'deviceDesc',
    key:'deviceDesc',
    ellipsis: {
        showTitle: false,
    },
    render: deviceDesc => (
        <Tooltip placement="topLeft" title={deviceDesc}>
            {deviceDesc}
        </Tooltip>
    ),
},
{
    title: '事件名称',
    dataIndex: 'eventName',
    key:'eventName',
    ellipsis: {
        showTitle: false,
    },
    render: eventName => (
        <Tooltip placement="topLeft" title={eventName}>
            {eventName}
        </Tooltip>
    ),
},
{
    title: '证件号码',
    dataIndex: 'identityNum',
    key:'identityNum',
    ellipsis: {
        showTitle: false,
    },
    render: identityNum => (
        <Tooltip placement="topLeft" title={identityNum}>
            {identityNum}
        </Tooltip>
    ),
},
{
    title: '抓拍照片',
    dataIndex: 'visitorPhotoUri',
    key:'visitorPhotoUri',
    render: url => <img src={url} style={{width:60,height:60}} alt="" />,
},
{
    title: '事件时间点',
    dataIndex: 'happenTimePage',
    key:'happenTimePage',
    ellipsis: {
        showTitle: false,
    },
    render: happenTimePage => (
        <Tooltip placement="topLeft" title={happenTimePage}>
            {happenTimePage}
        </Tooltip>
    ),
},]
export default class table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0,
            total:0,
            pageNo:1,
            pageSize:10,
            tableData: [],
            prevPagesize:10
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tableData !== prevProps.tableData) {
            this.setState({
                tableData: this.props.tableData,
                total:this.props.tableData.total
            })
        }
        
    }
    onChange(pageNo, pageSize){
        if(pageSize !== this.state.prevPagesize){
            pageNo = 1
        }
        this.setState({
            pageNo,
            pageSize,
            prevPagesize:pageSize
        })  
       this.props.parent.onSearch(pageNo, pageSize)
    }
    // onSelectChange = (selectedRowKeys,selectedRows) => {
    //     this.setState({
    //         selectedRowKeys
    //     })
    //     this.props.parent.setState({
    //         selectedRows:selectedRows
    //     })
    // };
    render() {
        // const {selectedRowKeys} = this.state
        // const rowSelection = {
        //   selectedRowKeys,
        //   onChange: this.onSelectChange,
        // };
        return (
            <ConfigProvider locale={zhCN}>
                <Table  columns={columns} dataSource={this.state.tableData && this.state.tableData.rows}
                    pagination={{
                        position: ['bottomRight'],
                        showSizeChanger: true,
                        total: this.state.total,
                        showTotal: total => `共计 ${total} 条`,
                        pageSize: this.state.pageSize,
                        current: this.state.pageNo,
                        pageSizeOptions: ['10', '20', '30', '50'],
                        onChange: (current,pageSize)=>this.onChange(current,pageSize)
                    }} 
                />
            </ConfigProvider>
        )
    }
}

