import React, { useState, useEffect } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega produtos e carrinho
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

  // Atualiza item
  const updateCartItem = (itemId, newQty) => {
    fetch(`http://localhost:3001/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: newQty }),
    }).catch((err) => console.log("Erro ao atualizar item:", err));
  };

  // Adiciona ao carrinho
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

  // Total
  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

  if (loading) return <p className="text-center py-10">Carregando...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Minha Loja</h1>
        <p className="text-lg">Produtos incríveis, preços imperdíveis!</p>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        {/* Produtos */}
        {products.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Produtos</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-600 mb-3">R$ {product.price}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            Nenhum produto disponível.
          </p>
        )}

        <h3 className="text-xl font-bold mt-6">
          Total do carrinho: R$ {total}
        </h3>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} Minha Loja
      </footer>
    </div>
  );
}
