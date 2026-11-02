import {useState, useMemo, useRef, useEffect} from "react";
import ProductItem from "./ProductItem";
import "./ShoppingCart.css"

function ShoppingCart() {
    const initialProducts = [
        {id: 1, name: "Lipstick", price: 30, quantity: 1},
        {id: 2, name: "Mascara", price: 50, quantity: 1},
        {id: 3, name: "BB cream", price: 110, quantity: 1},
        {id: 4, name: "Perfume", price: 200, quantity: 1}
    ];

    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem("products");

        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    });

    const nextId = useRef(5)

    const [newName, setNewName] = useState("")
    const [newPrice, setNewPrice] = useState("")
    const [showExpensive, setShowExpensive] = useState(false);

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);


    const increaseQuantity = (id) => {
        setProducts(prevProducts => prevProducts.map(product => {
            if (product.id === id) {
                return {...product, quantity: product.quantity + 1};
            }
            return product;
        }));
    };

    const decreaseQuantity = (id) => {
        setProducts(prevProducts => prevProducts.map(product => {
            if (product.id === id && product.quantity > 1) {
                return {...product, quantity: product.quantity - 1};
            }
            return product;
        }));
    };

    const removeProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    };

    const addProduct = (event) => {
        event.preventDefault()
        const price = Number(newPrice)

        if(!newName.trim() || Number.isNaN(price) || price <= 0) return;

        setProducts(prevProducts => [...prevProducts,
        {
            id: nextId.current++,
            name: newName,
            price,
            quantity: 1
        }]);

        setNewName("")
        setNewPrice("")
    }

    const filteredProducts = showExpensive ? products.filter(product => product.price > 100) : products; 

    const totals = useMemo(() => {
        return {
            all: products.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0),

            expensive: products.reduce((total, product) => {
                return product.price > 100 ? total + product.price * product.quantity : total;
            }, 0)
        };
    }, [products]);

    const totalPrice = showExpensive ? totals.expensive : totals.all;

    return (
        <div className="shopping-cart">
            <h1>Shopping Cart</h1>

            <form onSubmit={addProduct}>
                <input
                    type="text"
                    placeholder="Product name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Product price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                />

                <button type="submit">Add Product</button>
            </form>

            <label>
                <input
                    type="checkbox"
                    checked={showExpensive}
                    onChange={(e) => setShowExpensive(e.target.checked)}
                />
                Show only products over $100
            </label>

            <div className="products-list">
                {filteredProducts.length === 0 ? (<p>Cart is empty</p>) : (
                    filteredProducts.map(product => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            increaseQuantity={increaseQuantity}
                            decreaseQuantity={decreaseQuantity}
                            removeProduct={removeProduct}
                        />
                    ))
                )}
            </div>

            <h2>Total: ${totalPrice.toFixed(2)}</h2>
        </div>
    );
}

export default ShoppingCart;