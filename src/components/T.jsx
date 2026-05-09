import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const cache = {};

const translateText = async (text, to) => {
  if (!text || to === 'en') return text;
  const key = `${to}:${text}`;
  if (cache[key]) return cache[key];
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data[0].map(item => item[0]).join('');
    cache[key] = result;
    return result;
  } catch {
    return text;
  }
};

export default function T({ text, tag: Tag = 'span', className, style, children }) {
  const { lang } = useLanguage();
  const [translated, setTranslated] = useState(text || children || '');
  const original = text || children || '';
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (lang === 'en' || !original) {
      setTranslated(original);
      return;
    }
    setTranslated(original);
    translateText(original, lang).then(result => {
      if (mountedRef.current) setTranslated(result);
    });
  }, [lang, original]);

  if (Tag === 'none') return translated;
  return <Tag className={className} style={style}>{translated}</Tag>;
}