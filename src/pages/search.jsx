import React, { Component } from 'react'
import { Input, Button, DatePicker, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import './search.css'
import moment from 'moment';
import Table from './table'
import API from '../api'
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
export default class search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: {
        visitorName: '',
        eventTimeBegin: moment(moment(new Date()).startOf('day'), dateFormat),
        eventTimeEnd: moment(moment(new Date()).endOf('day'), dateFormat),
      },
      table: [],
      pageChange:false,
      selectedRows:[]
    }
  }
  componentDidMount(){
    this.onSearch()

  }
  onInputChange(e) {
    e.target && this.setState({
      search:{
        visitorName: e.target.value
      }    
    })
  }
  onChange(date, dateString) {
    date.dateString && this.setState({
      search:{
        eventTimeBegin: dateString[0],
        eventTimeEnd: dateString[1]
      }
    })
  }
  onSearch(pageNo = 1,pageSize = 10) {
    const params = {pageNo,pageSize,...this.state.search}
    API.post('/api/visitor/v1/event/turnover/search', params).then(({data}) => {
      data.rows = data.rows.map((el,index)=>{
        return {
          key:index,
        ...el
      }
      })
       this.setState({
          table:data
        })
    }).catch(e => {
      message.error('查询失败')
    })
  }
  onReset() {
    this.setState({
      serch: {
        visitorName: '',
        eventTimeBegin: moment(moment(new Date()).startOf('day'), dateFormat),
        eventTimeEnd: moment(moment(new Date()).endOf('day'), dateFormat),
      }
    })
  }
  onDownload(){
    console.log('select',this.state.selectedRows)
  }

  render() {

    return (
      <div className="qhh">
        <div className="qhh-search">
          <ul>
            <p type='title'>访客姓名</p>
            <Input placeholder='请输入' allowClear value={this.state.search.visitorName} onChange={e => this.onInputChange(e)}></Input>
          </ul>
          <ul className='rangePicker'>
            <p type='title'>来访时间</p>

            <RangePicker
              defaultValue={[this.state.search.eventTimeBegin, this.state.search.eventTimeEnd]}
              showTime
              format={dateFormat}
              onChange={() => this.onChange()}
            />

          </ul>
          <ul>
          <Button icon={<DownloadOutlined />} style = {{marginTop:42}} onClick = {()=>this.onDownload()}>下载</Button>
          
          </ul>

          <ul className="btns">
            <Button type="primary" className='btns-search' onClick={() => this.onSearch()}>查询</Button>
            <Button className='btns-search' onClick={() => this.onReset()}>重置</Button>
          </ul>
        </div>
        <div className="qhh-table">
          <Table  tableData={this.state.table}  parent = { this }></Table>
        </div>
      </div>

    )
  }
}

