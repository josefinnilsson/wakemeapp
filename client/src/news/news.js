import React, { Component } from 'react';
import './news.scss';


class News extends Component {
  constructor(props) {
    super(props)
    this.state = {
      news_html: ''
    }

    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh() {
    let news_type = '101'
    let options = {
      news: news_type
    }
    fetch('/news/' + news_type)
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({
          news_html: data
        })
      })
  }

  render() {
    const RefreshNews = () => {
      return (<button id='refresh_news' onClick={this.handleRefresh}>Refresh news</button>)
    }

    return (
      <div>
        <RefreshNews/>
        {this.state.news_html === '' ? '' : ReactHtmlParser(this.state.news_html)}
      </div>
    )
  }
}

export default News