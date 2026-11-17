'use client';
import { useState } from 'react';

const goods = [
  { name: 'Notebook', picture: '\u{1F4D3}', price: 30 },
  { name: 'Pencil', picture: '\u270F\uFE0F', price: 10 },
  { name: 'Apple', picture: '\u{1F34E}', price: 20 },
  { name: 'Toy rocket', picture: '\u{1F680}', price: 50 },
];
export function PocketShop() {
  const [cart, setCart] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  const spent = cart.reduce((sum, id) => sum + goods[id]!.price, 0);
  return (
    <section className="mini-world shop-world" aria-label="Pocket money shop">
      <div className="mini-heading">
        <span>YOUR MISSION</span>
        <h2>The pocket-money shop</h2>
        <p>Buy a notebook and pencil. Keep at least Rs 20 for later.</p>
      </div>
      <div className="shop-scene">
        <span aria-hidden="true">{'\u{1F3EA}'}</span>
        <div>
          <strong>Rs {100 - spent}</strong>
          <small>in your pocket</small>
        </div>
        <div>
          <strong>{cart.length}</strong>
          <small>in your basket</small>
        </div>
      </div>
      <div className="shop-shelf">
        {goods.map((g, i) => (
          <button
            key={g.name}
            disabled={won || spent + g.price > 100}
            onClick={() => {
              setCart([...cart, i]);
              setMessage(g.name + ' added!');
            }}
          >
            <span aria-hidden="true">{g.picture}</span>
            <strong>{g.name}</strong>
            <small>Rs {g.price} · Add +</small>
          </button>
        ))}
      </div>
      <div className="shop-basket">
        <h3>{'\u{1F9FA}'} Your basket</h3>
        {cart.length === 0 ? (
          <p>Tap something on the shelf.</p>
        ) : (
          cart.map((id, i) => (
            <button
              key={i}
              disabled={won}
              aria-label={'Remove ' + goods[id]!.name}
              onClick={() => {
                setCart(cart.filter((_, n) => n !== i));
                setMessage('Removed. Try another plan!');
              }}
            >
              {goods[id]!.picture} {goods[id]!.name} ×
            </button>
          ))
        )}
      </div>
      <div className="mini-controls">
        <button
          className="button"
          disabled={won}
          onClick={() => {
            const ok = cart.includes(0) && cart.includes(1) && spent <= 80;
            setWon(ok);
            setMessage(
              ok
                ? 'Mission complete! You bought your supplies and saved Rs ' + (100 - spent) + '.'
                : 'Try again: you need a notebook, a pencil and at least Rs 20 left. Remove an item from your basket if you need to.',
            );
          }}
        >
          Pack my bag
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setCart([]);
            setWon(false);
            setMessage('Fresh pocket money. Try a different basket!');
          }}
        >
          Start again
        </button>
      </div>
      <p className={'mini-feedback' + (won ? ' mini-win' : '')} role="status">
        {message || 'Can you afford everything? You decide.'}
      </p>
      <small>
        Imaginary shop prices. Game feedback stays in this visit; the optional learning check
        records progress.
      </small>
    </section>
  );
}
