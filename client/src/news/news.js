import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './news.scss'
import { DragSource, DropTarget } from 'react-dnd'
import _ from 'lodash'
import { Types, CompSource, CompTarget, collectSource, collectTarget } from '../actions/dndActions'

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

	handleRefresh(e) {
		// called by refresh button
		if (typeof e !== 'undefined') {
			this.setState({
				rotate: true
			})
		}
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

		const { connectDragSource, connectDropTarget } = this.props
		return connectDropTarget(connectDragSource(
			<div>
				<div className="coponent_title">
					<h4>Latest News</h4>
					<FontAwesomeIcon className={this.state.rotate ? 'refresh refresh_clicked' : 'refresh'} icon='redo' cursor='pointer' onClick={this.handleRefresh} onAnimationEnd={() => this.setState({rotate: false})}/>
				</div>
				<div className="news_wrapper">
					{news_div}
				</div>
			</div>
		))
	}
}

export default _.flow([DropTarget(Types.COMP, CompTarget, collectTarget),DragSource(Types.COMP, CompSource, collectSource)])(News)