import { useState } from "react";

export default function App() {
	const [items, setItems] = useState([]);

	function handleAddItem(item) {
		setItems((items) => [...items, item]);
	}

	function handleDeleteItem(id) {
		setItems((items) => items.filter((item) => item.id !== id));
	}

	return (
		<div className="app">
			<Logo />
			<Form onAddItem={handleAddItem} />
			<PackingList items={items} onDeleteItem={handleDeleteItem} />
			<Stats />
		</div>
	);
}

function Logo() {
	return <h1>🌴 Far Away 💼</h1>;
}

function Form({ onAddItem }) {
	const [description, setDescription] = useState("");
	const [quantity, setQuantity] = useState(1);

	function handleSubmit(e) {
		e.preventDefault();

		if (!description) return;

		const newItem = {
			quantity,
			description,
			packed: false,
			id: crypto.randomUUID(),
		};
		//You can as well use --- id: Date.now()--- in the newItem object
		onAddItem(newItem);

		setDescription("");
		setQuantity(1);
	}

	return (
		<form className="add-form" onSubmit={handleSubmit}>
			<h3>What do you need for your 😍 trip?</h3>
			<select
				value={quantity}
				onChange={(e) => setQuantity(Number(e.target.value))}>
				{Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
					<option value={num} key={num}>
						{num}
					</option>
				))}
			</select>
			<input
				type="text"
				placeholder="Item..."
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<button>Add</button>
		</form>
	);
}

function PackingList({ items, onDeleteItem }) {
	return (
		<div className="list">
			<ul>
				{items.map((item) => (
					<Item item={item} key={item.id} onDeleteItem={onDeleteItem}/>
				))}
			</ul>
		</div>
	);
}

function Item({ item: { id, description, quantity, packed }, onDeleteItem }) {
	return (
		<li>
			<span style={packed ? { textDecoration: "line-through" } : {}}>
				{quantity} {description}
			</span>
			<button onClick={() => onDeleteItem(id)}>❌</button>
		</li>
	);
}

function Stats() {
	return (
		<footer className="stats">
			<em>
				💼 You have X items on your list, and you already packed X (X%)
			</em>
		</footer>
	);
}
