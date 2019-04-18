import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

class BackgroundToggle extends Component {
	constructor(props) {
		super(props)
		this.state = {
			background: localStorage.getItem('background')
		}
	}
	onThemeChange(e) {
		this.setState({ background: e })
		if (e === 'Minimalistic') {
			localStorage.setItem('background_url', '')
			localStorage.setItem('background', 'Minimalistic')
			this.setState({
				background: localStorage.getItem('background')
			})
		} else {
			localStorage.setItem('background_url', 'https://source.unsplash.com/collection/137627/calm-wallpapers/daily/')
			localStorage.setItem('background', 'Unsplash')
			this.setState({
				background: localStorage.getItem('background')
			})
		}
	}

	render() {
		return (
			<div className="background_toggle">
				<Dropdown>
					<Dropdown.Toggle className="settings_btn background_btn" id="dropdown-basic">
						{this.state.background !== null ? this.state.background : 'Theme'}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item onClick={() => this.onThemeChange('Minimalistic')}>Minimalistic</Dropdown.Item>
						<Dropdown.Item onClick={() => this.onThemeChange('Unsplash')}>Unsplash</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		)
	}
}

export default BackgroundToggle