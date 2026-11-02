function ProductItem({ product, increaseQuantity, decreaseQuantity, removeProduct }) {
    return (
        <div className="product-item">
            <div className="product-info">
                <h2>{product.name}</h2>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
            </div>

            <div className="product-actions">
                <button onClick={() => decreaseQuantity(product.id)} disabled={product.quantity <= 1}>
                    -
                </button>

                <button onClick={() => increaseQuantity(product.id)}>
                    +
                </button>

                <button onClick={() => removeProduct(product.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProductItem;

