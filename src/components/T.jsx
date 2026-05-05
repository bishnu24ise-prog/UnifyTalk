import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../api';

// Global translation cache
const cache = {};

/**
 * <T text="Hello World" /> → renders translated text
 * Automatically translates to the selected app language.
 */
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

    const key = `${lang}:${original}`;
    if (cache[key]) {
      setTranslated(cache[key]);
      return;
    }

    // Show original while loading
    setTranslated(original);

    translateText({ text: original.substring(0, 450), from: 'en', to: lang })
      .then(r => {
        if (mountedRef.current && r.data.translatedText) {
          cache[key] = r.data.translatedText;
          setTranslated(r.data.translatedText);
        }
      })
      .catch(() => {});
  }, [lang, original]);

  if (Tag === 'none') return translated;
  return <Tag className={className} style={style}>{translated}</Tag>;
}
