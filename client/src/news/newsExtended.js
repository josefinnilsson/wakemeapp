import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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

    return (
      <div className='container news_extended_wrapper'>
        <div>
          <Link to='/'><button>Back to dashboard</button></Link>
          <div className='news_extended'>
            <h3>{this.state.title}</h3>
            {this.state.description !== '' ? this.state.description : ''}
            <br/><a href={this.state.url}>Läs mer</a>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsExtended