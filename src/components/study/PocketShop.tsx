'use client';
import { useState } from 'react';
import { useLanguage } from '@/components/accessibility/language';
import { ReadAloud } from '@/components/accessibility/ReadAloud';
import { AnswerEffect } from '@/components/accessibility/AnswerEffect';
import { shopNepali, shopSuccessNepali } from '@/data/play-nepali';

const goods = [
  { name: 'Notebook', picture: '\u{1F4D3}', price: 30 },
  { name: 'Pencil', picture: '\u270F\uFE0F', price: 10 },
  { name: 'Apple', picture: '\u{1F34E}', price: 20 },
  { name: 'Toy rocket', picture: '\u{1F680}', price: 50 },
];
export function PocketShop() {
  const { language } = useLanguage();
  const t = (text: string) => (language === 'ne' ? shopNepali[text] || text : text);
  const [attempt, setAttempt] = useState(0);
  const [cart, setCart] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  const spent = cart.reduce((sum, id) => sum + goods[id]!.price, 0);
  return (
    <section
      lang={language}
      className={'mini-world shop-world' + (attempt ? (won ? ' has-success' : ' has-retry') : '')}
      aria-label="Pocket money shop"
    >
      <div className="mini-heading">
        <span>{t('YOUR MISSION')}</span>
        <h2>{t('The pocket-money shop')}</h2>
        <p>{t('Buy a notebook and pencil. Keep at least Rs 20 for later.')}</p>
      </div>
      <ReadAloud key={language} language={language} clipId={'budget-' + language + '-intro'} />
      <AnswerEffect success={won} attempt={attempt} />
      <div className="shop-scene">
        <span aria-hidden="true">{'\u{1F3EA}'}</span>
        <div>
          <strong>Rs {100 - spent}</strong>
          <small>{t('in your pocket')}</small>
        </div>
        <div>
          <strong>{cart.length}</strong>
          <small>{t('in your basket')}</small>
        </div>
      </div>
      <div className="shop-shelf">
        {goods.map((g, i) => (
          <button
            key={t(g.name)}
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
        <h3>
          {'\u{1F9FA}'} {t('Your basket')}
        </h3>
        {cart.length === 0 ? (
          <p>{t('Tap something on the shelf.')}</p>
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
              {goods[id]!.picture} {t(goods[id]!.name)} ×
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
            setAttempt(attempt + 1);
            setMessage(
              ok
                ? 'Mission complete! You bought your supplies and saved Rs ' + (100 - spent) + '.'
                : 'Try again: you need a notebook, a pencil and at least Rs 20 left. Remove an item from your basket if you need to.',
            );
          }}
        >
          {t('Pack my bag')}
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setCart([]);
            setWon(false);
            setAttempt(0);
            setMessage('Fresh pocket money. Try a different basket!');
          }}
        >
          {t('Start again')}
        </button>
      </div>
      <p className={'mini-feedback' + (won ? ' mini-win' : '')} role="status">
        {won
          ? language === 'ne'
            ? shopSuccessNepali + (100 - spent)
            : message
          : t(message || 'Can you afford everything? You decide.')}
      </p>
      <small>
        {t(
          'Imaginary shop prices. Game feedback stays in this visit; the optional learning check records progress.',
        )}
      </small>
    </section>
  );
}
