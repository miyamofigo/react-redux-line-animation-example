import React from 'react'
import { connect } from 'react-redux'
import { setOffset } from '../actions'

const containerDefaults = {
  id: "container",
  innerWidth: "1400"
}

let Container = props => ( 
  <div id={containerDefaults.id}>
    <svg {...props} 
      width={containerDefaults.innerWidth}/>
  </div>
)

let lineDefaults = {
  id: "line",
  x1: "50",
  y1: "50",
  x2: "1250",
  y2: "50", 
  stroke: "red",
  strokeWidth: "20",
  strokeLinecap: "round",
  strokeOpacity: "0.7"
}

let getLength =  props =>
  props.x2 - props.x1

const delim = ' '

let toDasharray = length => 
  length + delim + length 

let getDasharray = (f => g => props =>
  f(g(props)))(toDasharray)(getLength)

let Line = ({strokeDashoffset}) => (
  <line id={lineDefaults.id} 
    x1={lineDefaults.x1} 
    y1={lineDefaults.y1}
    x2={lineDefaults.x2} 
    y2={lineDefaults.y2}
    stroke={lineDefaults.stroke}
    strokeWidth={lineDefaults.strokeWidth}
    strokeLinecap={lineDefaults.strokeLinecap}
    strokeOpacity={lineDefaults.strokeOpacity}
    strokeDasharray={getDasharray(lineDefaults)}
    strokeDashoffset={strokeDashoffset}
  />
)

const lineLen = getLength(lineDefaults) 
const sec = 1000
const fps = 60
const frame = sec / fps

let requestDrawFrame = callback => offset =>
  setTimeout(() => 
    callback(offset), frame)

let onDraw = dispatch => offset => {
  dispatch(setOffset(offset))

  if (offset / fps < 1) 
    requestDrawFrame(onDraw(dispatch))(offset + 1)
  else 
    console.log('done')
}

let mapStateToProps = state => Object
  .assign({}, {
    offset: state.offset
  })

let mapDispatchToProps = dispatch => {
  return {
    start: offset => 
      requestDrawFrame(onDraw(dispatch))(offset + 1) 
  }
}

class AbstractApp extends React.Component {
  componentDidMount() {
    this.props
      .start(this.props.offset)
  }

  toStrokeDashoffset(offset) {
    return Math
      .floor(lineLen * (1 - offset / fps))
  }

  render() {
    let offset = this.props.offset
    return (
      <Container>
        <Line strokeDashoffset={this
          .toStrokeDashoffset(offset)}/>
      </Container>
    ) 
  }
}

export default connect(mapStateToProps,
  mapDispatchToProps)(AbstractApp)

