import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './news.scss'

class NewsExtended extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      content: ''
    }
  }
  componentDidMount() {

    let news_url = this.props.match.params.url
    let all_news = JSON.parse(localStorage.getItem('news')).articles
    for(let i = 0; i < all_news.length; i++) {
      if (all_news[i].url === 'https://www.svd.se/' + news_url) {
        this.setState({
          title: all_news[i].title,
          description: all_news[i].description,
          url: all_news[i].url
        })
      }
    }

  }

  render() {

    const back_btn = <a className="back_btn news_back_btn" href="/"><FontAwesomeIcon icon="arrow-left"/></a>

    return (
      <div className='container'>
          <div className="row">
          {back_btn}

          <div className="col-md-3"></div>
          <div className="col-md-6">
          <div className="news_extended_wrapper">
          <h3 className="news_title">{this.state.title}</h3>
          <div className="news_extended">
            {this.state.description !== '' ? this.state.description : 'This article is locked under payment.'}
            <br/><a className="read_more" href={this.state.url} rel="noopener noreferrer" target='_blank'>Read more</a>
          </div>
          </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    )
  }
}

export default NewsExtended