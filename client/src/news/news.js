import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './news.scss';

class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      news: '',
      rotate: false
    }

    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
      this.handleRefresh()
  }

  handleRefresh() {
    this.setState({
      rotate: true
    })
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
    let news = []
    let news_div = []
    if (localStorage.getItem('news') !== null) {
      news = JSON.parse(localStorage.getItem('news')).articles
      if (typeof news !== 'undefined') {
        for (let i = 0; i < news.length; i++) {
          let link = '/news/' + news[i].url.split('.se/')[1]
          news_div.push(<Link key={news[i].url} to={link}><p className="news_desc"><FontAwesomeIcon className="news_arrow" icon="chevron-right"/> {news[i].title}</p></Link>)
        }
      }
    }

    return (
      <div>
        <FontAwesomeIcon className={this.state.rotate ? "refresh refresh_clicked" : "refresh"} icon='redo' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
        <div className="news_wrapper">
          {news_div}
        </div>
      </div>
    )
  }
}

export default News