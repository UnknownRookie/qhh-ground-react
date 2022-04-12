import React, { Component } from 'react'
import { Input, Button, DatePicker, message,ConfigProvider } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import './search.css'
import moment from 'moment';
import Table from './table'
import API from '../api'
import 'moment/locale/zh-cn';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
export default class search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: {
        visitorName: '',
        eventTimeBegin: '',
        eventTimeEnd: '',
      },
      table: [],
      pageChange: false,
      selectedRows: []
    }
  }
  componentDidMount() {
    this.setState({
      search: {
        eventTimeBegin: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eventTimeEnd: moment(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      }
    })

    this.timer = setTimeout(() => {
      this.onSearch()
    })
    this.prev = +new Date()
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  onInputChange(e) {
    let cur = +new Date()
    if(cur - this.prev<1000){
      this.prev = cur
      return 
    }
    e.target && this.setState({
      search: {
        ...this.state.search,
        visitorName: e.target.value
      }
    })
  }
  onChange(date, dateString) {
    dateString && this.setState({
      search: {
        visitorName: this.state.search.visitorName,
        eventTimeBegin: dateString[0],
        eventTimeEnd: dateString[1]
      }
    })
  }
  /**
   * @param {number} pageNo 
   * @param {number} pageSize 
   * @desc 搜索功能函数,table调用父组件函数
   */
  onSearch(pageNo = 1, pageSize = 10) {
    const params = { pageNo, pageSize, ...this.state.search }
    API.post('/eehds/visitor/list', params).then(({ data }) => {
      data.rows = data.records.map((el, index) => {
        return {
          key: index,
          ...el
        }
      })
      this.setState({
        table: data
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
  transObjectToStr(data){
    const array = []
    for(let key in data){
      array.push(`${key}=${data[key]}`)
    }
    return array.join('&')
  }
  /**
   * @desc 文件下载函数
   */
  onDownload() {
    const params = this.transObjectToStr({...this.state.search})
    const url = `/eehds/visitor/exportEvent?${params}`
    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('href', url)
    document.body.appendChild(a);
    a.click();
    // 然后移除
    document.body.removeChild(a)
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
            <ConfigProvider locale={zh_CN}>
            <RangePicker
              defaultValue={[moment(moment(new Date()).startOf('day'), dateFormat), moment(moment(new Date()).endOf('day'), dateFormat)]}
              showTime
              format={dateFormat}
              onChange={(date, dateString) => this.onChange(date, dateString)}
            />

            </ConfigProvider>
         
          </ul>
          <ul>
            <Button icon={<DownloadOutlined />} style={{ marginTop: 42 }} onClick={() => this.onDownload()}>下载</Button>
          </ul>
          <ul className="btns">
            <Button type="primary" className='btns-search' onClick={() => this.onSearch()}>查询</Button>
            <Button className='btns-search' onClick={() => this.onReset()}>重置</Button>
          </ul>
        </div>
        <div className="qhh-table">
          <Table tableData={this.state.table} parent={this}></Table>
        </div>
      </div>

    )
  }
}

