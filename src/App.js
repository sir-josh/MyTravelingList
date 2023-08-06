import { useState } from "react";

export default function App() {
	const [items, setItems] = useState([]);

	function handleAddItem(item) {
		setItems((items) => [...items, item]);
	}

	function handleDeleteItem(id) {
		setItems((items) => items.filter((item) => item.id !== id));
	}

	function handleToggleItem(id) {
		setItems((items) =>
			items.map((item) =>
				item.id === id ? { ...item, packed: !item.packed } : item,
			),
		);
	}

	function handleClearAllItems() {
		const confirm = window.confirm(
			"Are you sure you want clear all items?",
		);
		if (confirm) setItems([]);
	}

	return (
		<div className="app">
			<Logo />
			<Form onAddItem={handleAddItem} />
			<PackingList
				items={items}
				onDeleteItem={handleDeleteItem}
				onToggleItem={handleToggleItem}
				onClearList={handleClearAllItems}
			/>
			<Stats items={items} />
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

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
	const [sortBy, setSortBy] = useState("input");

	let sortItems;

	if (sortBy === "input") sortItems = items;
	if (sortBy === "description")
		sortItems = items
			.slice()
			.sort((a, b) => a.description.localeCompare(b.description));

	if (sortBy === "packed")
		sortItems = items
			.slice()
			.sort((a, b) => Number(a.packed) - Number(b.packed));

	return (
		<div className="list">
			<ul>
				{sortItems.map((item) => (
					<Item
						item={item}
						key={item.id}
						onDeleteItem={onDeleteItem}
						onToggleItem={onToggleItem}
					/>
				))}
			</ul>

			<div className="actions">
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}>
					<option value="input">Sort by input</option>
					<option value="description">Sort by description</option>
					<option value="packed">Sort by packed</option>
				</select>
				<button onClick={onClearList}>Clear list</button>
			</div>
		</div>
	);
}

function Item({
	item: { id, description, quantity, packed },
	onDeleteItem,
	onToggleItem,
}) {
	return (
		<li>
			<input
				type="checkbox"
				value={packed}
				onChange={() => onToggleItem(id)}
			/>
			<span style={packed ? { textDecoration: "line-through" } : {}}>
				{quantity} {description}
			</span>
			<button onClick={() => onDeleteItem(id)}>❌</button>
		</li>
	);
}

function Stats({ items }) {
	if (!items.length)
		return (
			<p className="stats">
				<em>Start adding some items to your packing list 🚀</em>
			</p>
		);

	const numItems = items.length;
	const numItemsPacked = items.filter((item) => item.packed).length;
	const percentagePacked = Math.round((numItemsPacked / numItems) * 100);

	return (
		<footer className="stats">
			<em>
				{percentagePacked === 100
					? "You got everything packing covered! Ready to go ✈"
					: `💼 You have ${numItems} ${
							numItems > 1 ? "items" : "item"
					  } on your list, and you already packed ${numItemsPacked} (${percentagePacked}%)`}
			</em>
		</footer>
	);
}
