import "./avatar.css";

const user = {
    name: "John Doe",
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
};

export default function Avatar(){
    return (
        <>
        <h1>
            {user.name}
        </h1>
        <img src={user.imageUrl} 
        alt={'Photo of' + user.name} 
        className="avatar"/>
        </>
    )
}

