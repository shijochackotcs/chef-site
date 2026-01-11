const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <main className="container">
      <header>
        <h1>Chef Site</h1>
        <p>Welcome! This is a minimal React setup without Vite.</p>
      </header>
      <section>
        <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
      </section>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
