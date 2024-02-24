function Button({ onClick, title }) {
  return (
    <button className="mr-3 rounded bg-slate-400 w-13 h-10" onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;
