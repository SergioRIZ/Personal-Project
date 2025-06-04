import { useState } from "react";

export default function MySecondButton() {
    const [count2, setCount2] = useState(0);
    function handleClick2() {
        setCount2(count2 + 1);
    }
    return (
        <button onClick={handleClick2}>Update Button {count2} times</button>
    )
}