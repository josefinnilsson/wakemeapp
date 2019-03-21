import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './news.scss';

class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      news: ''
    }

    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh() {
    fetch('/news')
      .then(response => {
        return response.json()
      })
      .then(data => {
        localStorage.setItem('news', JSON.stringify(data))
        this.setState({
          news: data
        })
      })
  }

  render() {
    const RefreshNews = () => {
      return (<button id='refresh_news' onClick={this.handleRefresh}>Refresh news</button>)
    }

    let news = []
    let news_div = []
    if (localStorage.getItem('news') !== null) {
      news = JSON.parse(localStorage.getItem('news')).articles
      if (typeof news !== 'undefined') {
        for (let i = 0; i < news.length; i++) {
          let link = '/news/' + news[i].url.split('.se/')[1]
          news_div.push(<Link key={news[i].url} to={link}><p>{news[i].title}</p></Link>)
        }
      }
    }

    return (
      <div>
        <RefreshNews/>
        <div className='news'>
          {news_div}
        </div>
      </div>
    )
  }
}

export default News