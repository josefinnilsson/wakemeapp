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
		} else if (e === 'NASA') {
			fetch('/nasa')
				.then(response => {
					return response.json()
				})
				.then(data => {
					localStorage.setItem('background_url', JSON.stringify(data))
					localStorage.setItem('background', 'NASA')
				})
		} else {
			fetch('/unsplash')
				.then(response => {
					return response.json()
				})
				.then(data => {
					console.log(data)
					localStorage.setItem('background_url', JSON.stringify(data.url))
					localStorage.setItem('background', 'Unsplash')

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
						<Dropdown.Item onClick={(e) => this.onThemeChange('Minimalistic')}>Minimalistic</Dropdown.Item>
						<Dropdown.Item onClick={(e) => this.onThemeChange('Unsplash')}>Unsplash</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		)
	}
}

export default BackgroundToggle