const products = [
    { product: "Cabbage", price: 1.99 },
    { product: "Carrot", price: 0.99 },
    { product: "Potato", price: 1.49 },
];

export default function ForLoop() {


const listItems = products.map(items =>
    <li key={products.price}>
        {items.product}
    </li>
);

return(
    <ul>{listItems}</ul>
);}