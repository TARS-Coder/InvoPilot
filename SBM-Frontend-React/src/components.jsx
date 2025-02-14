
export const TitleComponent = (props) => {
  return(
    <h2>{props.title}</h2>
    )
}


const TaskPrinterComponent = (props) => {
  return(
    <p>{props.index}. {props.task} -&gt; {props.res}</p>
  )
}

function NewTaskPrinter(props) {
  return(
    <p>{props.index}. {props.task} -&gt; {props.resources}</p>
  )
}

const Hello = ({name,age}) => {
  // Name and age items of props object are destructured
  // Component helper function
  const birth_year = () => new Date().getFullYear() - age;
  return (
    <div>
      <p>Hello {name}, How are you doing? </p>
      <p>I guess you were born in the year {birth_year()}</p>
    </div>
  )

} 

const DisplayCounts = ({counter}) => {
  return (
    <h2>Clicks: {counter} </h2>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const NewButton = ({text, onSmash}) => <button onClick={onSmash} >{text}</button>

const ClickHistory = ({clicks_count}) => {
  if(clicks_count.length === 0){
    return (
      <h3>No clicks</h3>
    )
  }
  return (
    <h3>Buttons Clicked:- {clicks_count.length}</h3>
  )
}

export default TitleComponent;