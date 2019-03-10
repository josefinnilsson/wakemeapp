import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

class BackgroundToggle extends Component {
    onThemeChange(e) {
        this.setState({ background: e })
        if (e === 'NONE') {
            console.log('none')
            document.body.style.backgroundImage = ""
        } else if (e === 'NASA') {
            fetch('/nasa')
            .then(response => {
                return response.json()
            })
            .then(data => {
                document.body.style.backgroundImage = `url(${data})`
            })
        } else {
            fetch('/unsplash')
            .then(response => {
                return response.json()
            })
            .then(data => {
                document.body.style.backgroundImage = `url(${data.url})`
            })
        }
    }

    render() {
        return (
            <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Theme
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => this.onThemeChange('NONE')}>Minimalistic</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => this.onThemeChange('NASA')}>NASA</Dropdown.Item>
                    <Dropdown.Item onClick={(e) => this.onThemeChange('UNSPLASH')}>Unsplash</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
        )
    }
}

export default BackgroundToggle