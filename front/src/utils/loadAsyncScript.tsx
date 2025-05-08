export const loadAsyncScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Erro ao carregar o script: ${src}`));
    document.body.appendChild(script);
  });
};
