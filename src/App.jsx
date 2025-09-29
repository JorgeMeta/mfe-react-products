import React, { useState, useEffect } from "react";
import styles from "./products.module.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/products").then((res) => res.json()),
      fetch("http://localhost:3001/cart").then((res) => res.json()),
    ])
      .then(([productsData, cartData]) => {
        setProducts(productsData);

        const mergedCart = cartData.map((item) => {
          const product = productsData.find(
            (p) => p.id.toString() === item.productId.toString()
          );
          return {
            ...item,
            name: product?.name ?? "Produto não encontrado",
            price: product?.price ?? 0,
            img: product?.img,
          };
        });

        setCart(mergedCart);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos ou carrinho:", err);
        setLoading(false);
      });
  }, []);

  const updateCartItem = (itemId, newQty) => {
    fetch(`http://localhost:3001/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: newQty }),
    }).catch((err) => console.log("Erro ao atualizar item:", err));
  };

  const addToCart = (product) => {
    const exists = cart.find(
      (item) => item.productId.toString() === product.id.toString()
    );

    if (exists) {
      const newQty = exists.qty + 1;
      updateCartItem(exists.id, newQty);
      setCart(
        cart.map((item) =>
          item.id === exists.id ? { ...item, qty: newQty } : item
        )
      );
    } else {
      const newItem = {
        productId: product.id,
        qty: 1,
        name: product.name,
        price: product.price,
        img: product.img,
      };

      fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((savedItem) => setCart([...cart, savedItem]))
        .catch((err) => console.log("Erro ao adicionar item:", err));
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

  if (loading) return <p className="text-center py-10">Carregando...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Minha Loja</h1>
        <p>Produtos incríveis, preços imperdíveis!</p>
      </header>

      <main className={styles.main}>
        {products.length > 0 ? (
          <>
            <h2>Produtos</h2>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageWrapper}>
                    <img
                      src={product.img}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p>R$ {product.price}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className={styles.addButton}
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Nenhum produto disponível.</p>
        )}

        <h3 className={styles.total}>Total do carrinho: R$ {total}</h3>
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Minha Loja
      </footer>
    </div>
  );
}
