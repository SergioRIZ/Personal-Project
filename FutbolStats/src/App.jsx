import Avatar from "./Avatar/Avatar"
import MySecondButton from "./MySecondButton";
import ForLoop from "./Rendering/forloop"
import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);
    function handleClick(){
        setCount(count + 1);
    }

  return (
<>
<h1>Counters that update together</h1>
<div className="button-container">
<MyButton count = {count} onclick = {handleClick}/>
<MyButton count = {count} onclick = {handleClick}/>
<MySecondButton/>
<MySecondButton/>
</div>
<Avatar/>
<ForLoop/>
</>
  )
}

function MyButton({onclick, count}) {
    return (
        <button onClick={onclick}>Update Button {count} times</button>
    )
}

export default App