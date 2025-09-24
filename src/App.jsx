import React from "react";
import "./index.css";

const products = [
  {
    id: 1,
    name: "Produto A",
    price: 100,
    img: "https://images.unsplash.com/photo-1493236272120-200db0da1927?w=400",
  },
  {
    id: 2,
    name: "Produto B",
    price: 200,
    img: "https://images.unsplash.com/photo-1748968217895-21f703fb65ad?w=400",
  },
  {
    id: 3,
    name: "Produto C",
    price: 300,
    img: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=400",
  },
];

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Minha Loja</h1>
          <p>Produtos incríveis, preços imperdíveis!</p>
          <button className="header-btn">Ver Produtos</button>
        </div>
      </header>

      <main className="main">
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-image">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="product-info">
                <h2>{p.name}</h2>
                <p>R$ {p.price}</p>
                <button>Adicionar ao carrinho</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Minha Loja
      </footer>
    </div>
  );
}
