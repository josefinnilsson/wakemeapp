export const Types = {
  COMP: 'comp',
}

export const CompSource = {
  canDrag(props, monitor) {
    return props.dragAllowed
  },

  beginDrag(props, monitor, component) {
    const item = { id: props.id }
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    const sourceComp = monitor.getItem()
    const dropComp = monitor.getDropResult()
    props.moveComp(sourceComp.id, dropComp.id)
  }
}

export const CompTarget = {
  drop(props) {
    return {
      id: props.id
    }
  }
}

export const collectSource = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource()
  }
}

export const collectTarget = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}