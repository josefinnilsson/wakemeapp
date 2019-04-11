export const Types = {
	COMP: 'comp',
}

export const CompSource = {
	beginDrag(props) {
		const item = { id: props.id }
		return item
	},

	endDrag(props, monitor) {
		if (!monitor.didDrop()) {
			return
		}
		const sourceComp = monitor.getItem()
		const dropComp = monitor.getDropResult()
		props.moveComp(sourceComp.id, dropComp.id)
	}
}

export const CompTarget = {
	drop(props) {
		return {
			id: props.id
		}
	}
}

export const collectSource = (connect) => {
	return {
		connectDragSource: connect.dragSource()
	}
}

export const collectTarget = (connect) => {
	return {
		connectDropTarget: connect.dropTarget(),
	}
}