import { useState } from 'react'
import TitleComponent from './components'

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

function TaskPrinterComponent(props) {
  return(
    <p>{props.index}. {props.task} -&gt; {props.res}</p>
  )
}

function NewTaskPrinter(props) {
  return(
    <p>{props.index}. {props.task} -&gt; {props.resources}</p>
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



function App () {
  const project_title = 'Indian Heritage: Free Tour';

  let index = 0;
 
  const task1 = 'Check Business profitabilty, Viability';
  const resources1 = 'Reserach online, look expected crowd';
  const task2 = 'Find a catchy name for the company';
  const resources2 = 'Do online research check for its availability';
  const task3 = 'Registration';
  const resources3 = 'Register the domain name, make social media profile account' 
  const task4 = 'launch';
  const resources4 = 'Build and launch the platform';


  const tasks = [
    {key : 1,
    task : 'Check Business profitabilty, Viability',
    resources : 'Reserach online, look expected crowd'},
 
    {key : 2,
    task : 'Find a catchy name for the company',
    resources : 'Do online research check for its availability'},

    {key : 3,
    task : 'Registration',
    resources : 'Register the domain name, make social media profile account'}, 

    {key : 4,
    task : 'launch',
    resources : 'Build and launch the platform'}
  ]

  const [ counter,  SetCounter] = useState(0);

  setTimeout( () => {
    SetCounter(counter + 1)
  }
  ,1000);


  const [click_count, Clicks] = useState(0);
  const ResetToZero = () => Clicks(0);

  const [click_count2, Clicks2] = useState(0);
  /* The below console will be RePrinted even without changing state of clicks2, because the change in state of SetCounter is ReRendering the whole App Component */
  /*console.log('Rendering with the counter value', click_count2)*/

  const increase = () => Clicks2(click_count2 + 1);
  const Reset2 = () => Clicks2(0);
  const decrease = () => Clicks2(click_count2 - 1);

  /* Complex State */

  const [left_right_state, UpdateLeftRight] = useState( {left: 0, right: 0})
  const [all_click, AllClickCount] = useState([]);

  const leftClicKHandleer = () => {
    const newState = {
      left: left_right_state['left'] + 1,
      right: left_right_state['right']
    }
    UpdateLeftRight(newState);
    AllClickCount(all_click.concat('L'))
  }

  /* Object spread ...object copies all data and explicitedly updated item are updated
  Instead of creating a temp state object direct state update fucntion is called
  */ 
  const rightClickHandler = () => {
    UpdateLeftRight({
      ...left_right_state,
      right: left_right_state.right + 1
    });
    AllClickCount(all_click.concat('R'))
  }

  return(

    <>
    <Hello name="Rajeev" age="27" />
    <Hello name="Marina" age="22" />
    <TitleComponent title={project_title} />
    <TaskPrinterComponent index= {++index} task={task1} res={resources1}/>
    <TaskPrinterComponent index= {++index} task={task2} res={resources2}/>
    <TaskPrinterComponent index= {++index} task={task3} res={resources3}/>
    <p>{++index}. {task4} :- {resources4}</p>

    {tasks.map( task => <NewTaskPrinter index= {task.key} key={task.key} task={task.task} resources={task.resources} /> )}

    <h2>Seconds passed: {Math.floor(counter/60)} Min {counter%60} Sec</h2>

    <button onClick={ () => Clicks(click_count + 1)}>
      Click Count
    </button>
    {/* Seperating event handlers into separate functions anyway */}
    <button onClick={ResetToZero}>
      Reset Click Count
    </button>
    {/* Passing state to child Component */}
    <DisplayCounts counter={click_count} />

    {/* Reeusing the child component */}
    {/* Here I will recreate the above count function*/}

    <Button onClick={increase} text={'Plus +'} />
    <Button onClick={decrease} text={'Minus -'} />
    <Button onClick={Reset2} text={'Reset 0'} />

    <DisplayCounts counter={click_count2} />

    {/* Complex state */}
    {left_right_state['left']}
    <NewButton text="Left" onSmash={leftClicKHandleer}/>
    <NewButton text="Right" onSmash={rightClickHandler}/>
    {left_right_state.right}
    <h3>{all_click.join(' ')}</h3>

    <ClickHistory clicks_count={all_click} /> 
    </>


  )
}







function js_datatype_practice() {

  const object_example = {
    title : 'Establish a big company',
    year : 2024,
    cities : ['Delhi', 'Agra', 'Jaipur']
  }
  console.log(object_example.title);

  // Arrow Function

  const sum = (d1, d2) => {
    console.log('Adding ' + d1 + ' and ' + d2);
    return d1 + d2;
  }

  const result = sum(5,2);
  console.log(result);
  
// Handling single parameter and single expression with arrow function

const hi = name => console.log('Hi! '+ name);
hi('John Doe');

// Using with Map on arrays

const num = [2,3,4];
console.log(num.map(n => n * n));

// Defining function through expression

const avg = function(a,b) {
  return (a + b) / 2;
}
console.log(avg(5,8));

}

js_datatype_practice();

export default App;